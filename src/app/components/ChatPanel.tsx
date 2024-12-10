import { useState, useEffect, useRef } from "react";
import BubbleMessage from "./BubbleMessage";
import { Message } from "@/types/types";

type ChatPanelProps = {
  messages: Message[];
  sendMessage: (input: string) => Promise<void>;
  isLoading: boolean;
};

export default function ChatPanel({
  messages,
  sendMessage,
  isLoading,
}: ChatPanelProps) {
  const [input, setInput] = useState<string>("");
  const [dots, setDots] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]); // ローカル状態
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // `messages` の変更を監視し、ローカルメッセージを更新
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // ローディング中の「...」アニメーション
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // メッセージの末尾にスクロール
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };

    // ローカルメッセージに追加
    setLocalMessages((prev) => [...prev, userMessage]);

    // メッセージ送信
    setInput("");
    await sendMessage(input);
  };

  return (
    <div
      style={{
        padding: 20,
        borderLeft: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        width: "400px",
      }}
    >
      <div
        style={{
          flex: 1,
          marginBottom: 20,
          overflowY: "auto",
          overflowX: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style>
          {`
          /* スクロールバーを完全に非表示にする */
          div::-webkit-scrollbar {
            display: none; /* Chrome、Safari用 */
          }
        `}
        </style>
        {localMessages.map((msg, index) => (
          <BubbleMessage key={index} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading && (
          <div
            style={{
              padding: "10px",
              color: "#555",
              textAlign: "left",
            }}
          >
            考え中{dots}
          </div>
        )}
        {/* スクロール対象の要素 */}
        <div ref={messageEndRef} />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 15px",
            borderRadius: "20px",
            backgroundColor: "#4CAF50",
            color: "#FFF",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "考え中..." : "Send"}
        </button>
      </div>
    </div>
  );
}
