import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { parseYAML } from "@/utils/parseYAML";

const STABILITY_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;
const API_HOST = "https://api.stability.ai";
const ENGINE_ID = "stable-diffusion-v1-6";

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

    const requestBody = {
      text_prompts: [{ text: fullPrompt }],
      cfg_scale: 7.5,
      height: 512,
      width: 512,
      samples: 1,
      steps: 30,
    };

    const response = await axios.post(
      `${API_HOST}/v1/generation/${ENGINE_ID}/text-to-image`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const base64Image = response.data.artifacts[0].base64;

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
