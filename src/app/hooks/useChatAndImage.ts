import { useState } from "react";
import axios from "axios";
import { Message } from "@/types/types";
import { getProgress, saveProgress, UserProgress } from "@/utils/localStrage";

export function useChatAndImage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessageAndGenerateImage = async (
    input: string
  ): Promise<{ progress: UserProgress | null; success: boolean }> => {
    if (isLoading) return { progress: null, success: false };
    setIsLoading(true);

    const progress = getProgress();

    if (!progress) {
      setIsLoading(false);
      return { progress: null, success: false };
    }

    const isFirstMessage = progress.history.length === 0;

    // ユーザーメッセージ送信は初回以外のみ（初回は空文字で送るがユーザーメッセージは追加しない）
    if (!isFirstMessage) {
      const userMessage: Message = { sender: "user", text: input };
      // ここでは一時的にローカルステートのprogressを更新しておく
      progress.history.push(userMessage);
    }

    try {
      // APIリクエストを並列で送信
      const [chatResponse, imageResponse] = await Promise.all([
        axios.post("/api/chat", {
          message: input,
          progress: {
            currentChapter: progress.currentChapter,
            remainingTurns: progress.remainingTurns,
            history: progress.history,
          },
        }),
        axios.post("/api/generateImage", {
          progress: {
            currentChapter: progress.currentChapter,
            remainingTurns: progress.remainingTurns,
          },
        }),
      ]);

      // 画像レスポンスを処理
      const imageUrl = imageResponse.data.imageUrl;

      // チャットレスポンスを処理
      const { progress: updatedProgress } = chatResponse.data;

      if (updatedProgress) {
        updatedProgress.generatedImage = imageUrl;
        saveProgress(updatedProgress);
        return { progress: updatedProgress, success: true };
      } else {
        return { progress: progress, success: true };
      }
    } catch {
      return { progress: null, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, sendMessageAndGenerateImage };
}
