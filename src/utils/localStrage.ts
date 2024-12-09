import { Message } from "@/types/types";

export interface UserProgress {
  currentChapter: string; // 現在のチャプター名
  remainingTurns: number; // 現在のチャプターの残りターン数
  history: Message[];
  generatedImages: string[];
}

const LOCAL_STORAGE_KEY = "gameProgress";

/**
 * 現在の進行状況を取得します。
 */
export const getProgress = (): UserProgress | null => {
  const progressData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return progressData ? JSON.parse(progressData) : null;
};

/**
 * 進行状況を保存します。
 * @param progress 保存する進行状況データ
 */
export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
};

/**
 * ゲームを初期化します。
 * @param initialChapter 初期チャプター名
 * @param initialTurns 初期残りターン数
 */
export const initializeGame = (
  initialChapter: string,
  initialTurns: number
): void => {
  const initialProgress: UserProgress = {
    currentChapter: initialChapter,
    remainingTurns: initialTurns,
    history: [],
    generatedImages: [],
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProgress));
};

/**
 * ゲームをリセットします。
 */
export const resetGame = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  initializeGame("prologue", 3);
};

/**
 * 現在のチャプターを更新します。
 * @param newChapter 新しいチャプター名
 */
export const updateChapter = (newChapter: string): void => {
  const progress = getProgress();
  if (progress) {
    progress.currentChapter = newChapter;
    saveProgress(progress);
  }
};

/**
 * 残りターン数を設定します。
 * @param turns 新しい残りターン数
 */
export const setRemainingTurns = (turns: number): void => {
  const progress = getProgress();
  if (progress) {
    progress.remainingTurns = turns;
    saveProgress(progress);
  }
};

/**
 * 残りターン数を1減らします。
 */
export const decrementTurns = (): void => {
  const progress = getProgress();
  if (progress && progress.remainingTurns > 0) {
    progress.remainingTurns -= 1;
    saveProgress(progress);
  }
};

/**
 * メッセージ履歴に新しいメッセージを追加します。
 * @param message 新しいメッセージ
 */
export const addMessageToHistory = (message: Message): void => {
  const progress = getProgress();
  if (progress) {
    progress.history.push(message);
    saveProgress(progress);
  }
};

/**
 * 生成された画像のURLを履歴に追加します。
 * @param imageUrl 追加する画像のURL
 */
export const addImageToHistory = (imageUrl: string): void => {
  const progress = getProgress();
  if (progress) {
    progress.generatedImages.push(imageUrl);
    saveProgress(progress);
  }
};
