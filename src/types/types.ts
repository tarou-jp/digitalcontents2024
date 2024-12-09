// src/types/types.ts

export enum Impact {
  MEMORY_RECOVERED = "memory_recovered",
  MEMORY_REFUSED = "memory_refused",
  ENCOURAGE_ACCEPTANCE = "encourage_acceptance",
  ENCOURAGE_REJECTION = "encourage_rejection",
  ENCOURAGE_NEUTRAL = "encourage_neutral",
  COLLABORATE = "collaborate",
  FINAL_ACCEPT = "final_accept",
  FINAL_REJECT = "final_reject",
  FINAL_NEUTRAL = "final_neutral",
  FINAL_SELF_ACCEPT = "final_self_accept",
}

export type Choice = {
  id: number;
  patterns: string[];
  next_scene?: string;
};

export type Scene = {
  goal: string;
  description: string;
  avatar_dialogue: string;
  choices: Choice[];
  max_turns?: number;
};

export type GameData = {
  game: {
    title: string;
    genre: string;
    settings: {
      main_location: {
        name: string;
        description: string;
        visual_style: string;
        audio_style: string;
      };
    };
    characters: {
      avatar: {
        name: string;
        role: string;
        personality: string[];
        background: string;
        objectives: string[];
      };
    };
    story: { [sceneName: string]: Scene };
  };
};

export type Message = {
  sender: "user" | "bot";
  text: string;
};

// 追加: LLMMessage の定義
export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// 追加: SystemPrompt の定義
export type SystemPrompt = {
  title: string;
  genre: string;
  theme: string;
  current_chapter: string;
  remaining_turns: number;
  chapter_goal: string;
  game_objective: string;
  character_info: CharacterInfo[];
  story_setting: string;
};

export type CharacterInfo = {
  name: string;
  description: string;
};
