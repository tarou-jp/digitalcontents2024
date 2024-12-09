"use client";

import React, { useEffect, useState } from "react";
import ImagePanel from "./components/ImagePanel";
import ChatPanel from "./components/ChatPanel";
import { useChatAndImage } from "./hooks/useChatAndImage";
import {
  initializeGame,
  getProgress,
  UserProgress,
  resetGame,
} from "@/utils/localStrage";

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

  const handleGameEnd = () => {
    if (isGameStarted) {
      // ゲームを終了し、ローカルストレージをリセット
      resetGame();
      setIsGameStarted(false);
      setProgress(null);
    }
  };

  const editScenario = () => {
    alert(
      "シナリオ編集機能は現在準備中です。好きなギャルゲー作れるようにしようとしたけど、時間なかったです、"
    );
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // ホーム画面の表示
  return isGameStarted ? (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* 右上の3点リーダー */}
      {/* 右上の3点リーダー */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 1000,
          width: "50px",
          height: "50px",
          backgroundColor: "#4CAF50", // 緑色でギャルゲーの柔らかい雰囲気
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45A049")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
      >
        <button
          onClick={toggleMenu}
          style={{
            background: "none",
            height: "100%",
            width: "100%",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          ⋮
        </button>

        {/* 小さなモーダル */}
        {isMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px", // 3点リーダーのボタンの下に表示
              right: "0px", // ボタンの右端に揃える
              padding: "10px",
              backgroundColor: "#FFF",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 1001,
              width: "300px", // 幅を固定
              textAlign: "center", // 中央揃え
            }}
          >
            <button
              onClick={handleGameEnd}
              style={{
                backgroundColor: "#FF6F61",
                color: "#FFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#FF4A3D";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6F61";
              }}
            >
              ゲームを終了
            </button>
          </div>
        )}
      </div>

      {/* メインコンテンツ */}
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
  ) : (
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
