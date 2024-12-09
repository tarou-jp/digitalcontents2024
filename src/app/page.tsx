"use client";

import React, { useEffect, useState } from "react";
import ImagePanel from "./components/ImagePanel";
import ChatPanel from "./components/ChatPanel";
import { useChatAndImage } from "./hooks/useChatAndImage";
import { initializeGame, getProgress, UserProgress } from "@/utils/localStrage";

export default function Home() {
  const { isLoading, sendMessageAndGenerateImage } = useChatAndImage();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const initialProgress = getProgress();
    if (initialProgress) {
      setProgress(initialProgress);
      setIsGameStarted(initialProgress.history.length > 0);
    } else {
      initializeGame("prologue", 3);
      setProgress(getProgress());
    }
  }, []);

  const startGame = async () => {
    // 初回メッセージ（空）を送信し、結果を受け取る
    const { progress, success } = await sendMessageAndGenerateImage("");

    if (success && progress) {
      // 最新の進行状況を反映
      setProgress(progress);
      setIsGameStarted(true); // ゲーム開始フラグを更新
    } else {
      console.log(progress, success);
      console.error("ゲーム開始中にエラーが発生しました。");
    }
  };

  const handleSendMessage = async (input: string) => {
    const { progress, success } = await sendMessageAndGenerateImage(input);

    if (success && progress) {
      setProgress(progress);
    } else {
      console.error("メッセージ送信または画像生成に失敗しました。");
    }
  };

  const editScenario = () => {
    alert("シナリオ編集機能は現在準備中です。");
  };

  if (isGameStarted) {
    // ゲームが開始されている場合の表示
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <ImagePanel
          imageUrl={progress?.generatedImages.at(-1) || null}
          isLoading={isLoading}
        />
        <ChatPanel
          messages={progress?.history || []}
          sendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // ホーム画面の表示
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/path/to/background-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={startGame}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "2px solid #007BFF",
            backgroundColor: "transparent",
            color: "#007BFF",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (
            (e.currentTarget.style.backgroundColor = "#007BFF"),
            (e.currentTarget.style.color = "#ffffff")
          )}
          onMouseOut={(e) => (
            (e.currentTarget.style.backgroundColor = "transparent"),
            (e.currentTarget.style.color = "#007BFF")
          )}
        >
          ゲームを始める
        </button>
        <button
          onClick={editScenario}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "2px solid #28A745",
            backgroundColor: "transparent",
            color: "#28A745",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (
            (e.currentTarget.style.backgroundColor = "#28A745"),
            (e.currentTarget.style.color = "#ffffff")
          )}
          onMouseOut={(e) => (
            (e.currentTarget.style.backgroundColor = "transparent"),
            (e.currentTarget.style.color = "#28A745")
          )}
        >
          ゲームシナリオを編集する
        </button>
      </div>
    </div>
  );
}
