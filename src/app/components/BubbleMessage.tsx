import React from "react";

type BubbleMessageProps = {
  sender: "user" | "bot";
  text: string;
};

export default function BubbleMessage({ sender, text }: BubbleMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px", // 吹き出し同士の間隔
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: "10px 15px",
          maxWidth: "50%", // 最大幅は親の50%まで
          color: "#FFF",
          fontSize: "16px",
          background: "#a58eff",
          borderRadius: "16px",
          boxSizing: "border-box",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          textAlign: "left",
        }}
      >
        {text}
        <div
          style={{
            content: '""',
            position: "absolute",
            bottom: "5px", // 尻尾が吹き出しとつながるよう調整
            [isUser ? "right" : "left"]: "-10px", // 尻尾の位置を調整
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: "10px",
            borderColor: `transparent transparent #a58eff transparent`,
            transform: isUser ? "rotate(45deg)" : "rotate(-45deg)",
          }}
        ></div>
      </div>
    </div>
  );
}
