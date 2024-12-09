// import { Message } from "@/types/types";

// export interface UserSession {
//   currentChapter: string; // 現在のチャプター名
//   remainingTurns: number; // 現在のチャプターの残りターン数
//   history: Message[];
// }

// // ユーザーごとのセッションを管理するMap
// const sessions = new Map<string, UserSession>();

// /**
//  * 現在のセッションを取得します。
//  * @param sessionId セッションID
//  */
// export const getSession = (sessionId: string): UserSession | null => {
//   return sessions.get(sessionId) || null;
// };

// /**
//  * 新しいセッションを設定します。
//  * @param sessionId セッションID
//  * @param newSession 新しいセッションデータ
//  */
// export const setSession = (
//   sessionId: string,
//   newSession: UserSession
// ): void => {
//   sessions.set(sessionId, newSession);
// };

// /**
//  * セッションを初期化します。
//  * @param sessionId セッションID
//  * @param initialChapter 初期チャプター名
//  * @param initialTurns 初期残りターン数
//  */
// export const initializeSession = (
//   sessionId: string,
//   initialChapter: string,
//   initialTurns: number
// ): void => {
//   const newSession: UserSession = {
//     currentChapter: initialChapter,
//     remainingTurns: initialTurns,
//     history: [],
//   };
//   sessions.set(sessionId, newSession);
// };

// /**
//  * セッションをリセットします。
//  * @param sessionId セッションID
//  */
// export const resetSession = (sessionId: string): void => {
//   sessions.delete(sessionId);
// };

// /**
//  * 現在のチャプターを更新します。
//  * @param sessionId セッションID
//  * @param newChapter 新しいチャプター名
//  */
// export const updateCurrentChapter = (
//   sessionId: string,
//   newChapter: string
// ): void => {
//   const session = sessions.get(sessionId);
//   if (session) {
//     session.currentChapter = newChapter;
//     sessions.set(sessionId, session);
//   }
// };

// /**
//  * 残りターン数を設定します。
//  * @param sessionId セッションID
//  * @param turns 残りターン数
//  */
// export const setRemainingTurns = (sessionId: string, turns: number): void => {
//   const session = sessions.get(sessionId);
//   if (session) {
//     session.remainingTurns = turns;
//     sessions.set(sessionId, session);
//   }
// };

// /**
//  * 残りターン数を1減らします。
//  * @param sessionId セッションID
//  */
// export const decrementTurns = (sessionId: string): void => {
//   const session = sessions.get(sessionId);
//   if (session && session.remainingTurns > 0) {
//     session.remainingTurns -= 1;
//     sessions.set(sessionId, session);
//   }
// };

// /**
//  * メッセージ履歴に新しいメッセージを追加します。
//  * @param sessionId セッションID
//  * @param message 新しいメッセージ
//  */
// export const addMessageToHistory = (
//   sessionId: string,
//   message: Message
// ): void => {
//   const session = sessions.get(sessionId);
//   if (session) {
//     session.history.push(message);
//     sessions.set(sessionId, session);
//   }
// };
