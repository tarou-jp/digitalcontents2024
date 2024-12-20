"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import ImagePanel from "./components/ImagePanel";
import { useChatAndImage } from "./hooks/useChatAndImage";
import {
  initializeGame,
  getProgress,
  UserProgress,
  resetGame,
} from "@/utils/localStrage";
import FloatingUIWindow from "./components/FloatingUIWindow";
import { useSnackbar } from "./SnackbarProvider";

export default function Home() {
  const { isLoading, sendMessageAndGenerateImage } = useChatAndImage();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { showSnackbar } = useSnackbar();

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
    const { progress, success } = await sendMessageAndGenerateImage("");

    if (success && progress) {
      setProgress(progress);
      setCurrentTurn(0);
      setIsGameStarted(true);
    } else {
      showSnackbar("ゲーム開始中にエラーが発生しました。", "error"); // エラー表示
    }
  };

  // メッセージ送信時のエラーハンドリング付き処理
  const handleSendMessage = async (input: string) => {
    const { progress, success } = await sendMessageAndGenerateImage(input);

    if (success && progress) {
      setProgress(progress);
      setCurrentTurn((prevTurn) => prevTurn + 1);
    } else {
      showSnackbar("生成に失敗しました。再度お試しください", "error"); // エラー表示
    }
  };

  const handleGameEnd = () => {
    resetGame();
    setIsGameStarted(false);
    setProgress(null);
  };

  const editScenario = () => {
    alert(
      "シナリオ編集機能は現在準備中です。好きなギャルゲー作れるようにしようとしたけど、時間なかったです。"
    );
  };

  const [currentTurn, setCurrentTurn] = useState<number>(0);

  const handleSelectTurn = (turn: number) => {
    console.log(progress);
    console.log(turn);
    setCurrentTurn(turn);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {isGameStarted && progress ? (
        <Box sx={{ display: "flex", position: "relative", width: "100%" }}>
          <ImagePanel
            imageUrl={progress?.generatedImage || null}
            isLoading={isLoading}
          />
          <FloatingUIWindow
            progress={progress}
            sendMessage={handleSendMessage}
            isLoading={isLoading}
            handleGameEnd={handleGameEnd}
            currentTurn={currentTurn}
            handleSelectTurn={handleSelectTurn}
          />
        </Box>
      ) : !isLoading ? (
        <Box
          sx={{
            position: "absolute",
            bottom: "10%", // 画面下側に設置
            left: "50%",
            transform: "translateX(-50%)", // 水平中央揃え
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px", // ボタン間の隙間
          }}
        >
          <Button
            variant="outlined"
            onClick={startGame}
            sx={{
              padding: "15px 30px",
              fontSize: "18px",
              borderRadius: "8px",
              borderColor: "#007BFF",
              color: "#007BFF",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#007BFF",
                color: "#ffffff",
              },
              mb: 2,
            }}
          >
            ゲームを始める
          </Button>
          <Button
            variant="outlined"
            onClick={editScenario}
            sx={{
              padding: "15px 30px",
              fontSize: "18px",
              borderRadius: "8px",
              borderColor: "#28A745",
              color: "#28A745",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#28A745",
                color: "#ffffff",
              },
            }}
          >
            ゲームシナリオを確認する
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <CircularProgress sx={{ color: "#007BFF" }} />
        </Box>
      )}
    </Box>
  );
}
