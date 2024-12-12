// src/utils/executeLLM.ts

import OpenAI from "openai";
import { LLMMessage, Message } from "@/types/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type LLMInput = {
  systemMessage: string;
  history: Message[];
  prompt: string;
};

export const executeLLM = async ({
  systemMessage,
  history,
  prompt,
}: LLMInput): Promise<string> => {
  try {
    // システムメッセージと過去の履歴、そして新しいプロンプトを組み合わせる
    const messages: LLMMessage[] = [
      {
        role: "system",
        content: systemMessage,
      },
      ...history.map(
        (msg): LLMMessage => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content:
            msg.sender === "bot"
              ? `{ "serif": "${msg.text}", "next_scene": "" }`
              : msg.text,
        })
      ),
      { role: "user", content: prompt },
    ];

    console.log(messages);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0].message?.content?.trim() ||
      "何をいってるんだい。もう一度わかりやすく説明してくれ"
    );
  } catch (error) {
    console.error("Error in executeLLM:", error);
    return "エラーが発生しました。再度お試しください。";
  }
};
