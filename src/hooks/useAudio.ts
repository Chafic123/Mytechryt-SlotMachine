// src/hooks/useSound.ts
import { useCallback } from "react";

export const useAudio = () => {
  const playSound = useCallback((file: string) => {
    const audio = new Audio(`../../sounds/${file}`);
    audio.volume = 0.6;
    audio.play().catch((e) => {
      console.warn("Audio playback failed:", e);
    });
  }, []);

  return { playSound };
};
