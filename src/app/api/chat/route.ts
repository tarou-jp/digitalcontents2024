import { NextRequest, NextResponse } from "next/server";
import { executeLLM } from "@/utils/executeLLM";
import { parseYAML } from "@/utils/parseYAML";

export async function POST(req: NextRequest) {
  const { message: inputMessage, progress } = await req.json();

  if (typeof inputMessage !== "string") {
    return NextResponse.json(
      { reply: "不正なリクエストです。" },
      { status: 400 }
    );
  }

  if (
    !progress ||
    !progress.currentChapter ||
    typeof progress.remainingTurns !== "number" ||
    !Array.isArray(progress.history)
  ) {
    return NextResponse.json(
      { reply: "不正なprogressデータが送信されました。" },
      { status: 400 }
    );
  }

  // ゲーム終了状態チェック
  if (progress.currentChapter === "finish") {
    return NextResponse.json({
      progress: {
        currentChapter: "finish",
        remainingTurns: 0,
        history: progress.history,
      },
    });
  }

  const gameData = parseYAML();

  const currentScene = gameData.game.story[progress.currentChapter];

  if (!currentScene) {
    return NextResponse.json(
      { reply: "現在のチャプターが存在しません。" },
      { status: 500 }
    );
  }

  let message = inputMessage;
  if (progress.history.length === 0) {
    message = currentScene.first_message || "ゲームスタート"; // 初期メッセージに上書き
  }

  const formattedChoices = currentScene.choices
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (choice: any, index: any) =>
        `選択肢${index + 1}: ${choice.patterns.join(", ")} -> 次のチャプター: ${
          choice.next_scene
        }`
    )
    .join("\n");

  const systemMessage = `
    ゲームタイトル: ${gameData.game.title}
    ジャンル: ${gameData.game.genre}
    テーマ: ${gameData.game.thema}
    現在のチャプター: ${progress.currentChapter}
    残りターン数: ${progress.remainingTurns}
    チャプターのゴール: ${currentScene.goal}
    チャプターの説明: ${currentScene.description}
    キャラクター情報:
      - 名前: ${gameData.game.characters.avatar.name}
      - 性格: ${gameData.game.characters.avatar.personality}
      - 設定: ${gameData.game.characters.avatar.background}
    ストーリー設定:
      - 空間説明 ${gameData.game.settings.main_location.description}
      - 空間の見た目 ${gameData.game.settings.main_location.visual_style}
    プレイヤーの選択肢:
      ${formattedChoices}
    禁止事項:
      - ターン数を出力させること。
      - 出力形式のフォーマットを守らないこと。

    プレイヤーの選択肢に基づき、次の応答を生成してください。

    出力形式:
    { "serif": "アリスの発言を記述してください。", "next_scene": "次のチャプター名を指定してください。" }

    - serif: アリスの発言
    - next_scene: 次に進むチャプター名。進まない場合は空文字列 "" を指定。

    この出力形式は絶対守ってください。
  `;

  console.log("プロンプト:", systemMessage);

  const response = await executeLLM({
    systemMessage,
    history: progress.history,
    prompt: message,
  });

  console.log("返信:", response);

  let aiOutput;
  try {
    aiOutput = JSON.parse(response);
    if (!aiOutput.serif || typeof aiOutput.next_scene !== "string") {
      throw new Error("不正な応答形式です。");
    }
  } catch (error) {
    console.error("AI応答の解析エラー:", error);
    return NextResponse.json(
      { reply: "AI応答の解析に失敗しました。" },
      { status: 500 }
    );
  }

  let newChapter = progress.currentChapter;
  let newRemainingTurns = progress.remainingTurns;

  if (aiOutput.next_scene && aiOutput.next_scene !== "") {
    const nextSceneData = gameData.game.story[aiOutput.next_scene];
    if (nextSceneData) {
      newChapter = aiOutput.next_scene;
      newRemainingTurns = nextSceneData.max_turns || 3;
    }
  } else {
    // 次のシーンが指定されていない場合は現在のチャプターを維持
    newRemainingTurns = Math.max(0, progress.remainingTurns - 1);
  }

  return NextResponse.json({
    progress: {
      currentChapter: newChapter,
      remainingTurns: newRemainingTurns,
      history: [...progress.history, { sender: "bot", text: aiOutput.serif }],
      generatedImages: progress.generatedImages,
    },
  });
}
