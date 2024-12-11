import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { parseYAML } from "@/utils/parseYAML";

const STABILITY_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { progress } = await req.json();

    if (!progress) {
      return NextResponse.json(
        { error: "必要なデータが不足しています。" },
        { status: 400 }
      );
    }

    const gameData = parseYAML();
    const mandatoryPrompt = gameData.game.mandatory_prompt;
    const currentScene = gameData.game.story[progress.currentChapter];

    const fullPrompt = `
      ${mandatoryPrompt}
      ${currentScene.image_prompt}
    `.trim();

    const params = {
      prompt: fullPrompt, // 必須プロンプト
      negative_prompt: "", // 必要なら否定プロンプトを指定
      aspect_ratio: "1:1", // アスペクト比、例: "1:1" や "16:9"
      seed: Math.floor(Math.random() * 1000000), // ランダムなシード値
      output_format: "png", // 出力形式を指定 (例: "png")
    };

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      params,
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const base64Image = response.data.image;

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    console.error("Error during image generation:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("API Response Error:", error.response.data);
    }

    return NextResponse.json(
      { error: "画像生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
