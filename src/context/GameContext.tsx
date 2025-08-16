import React, { createContext, useContext, useState } from "react";
import { SYMBOLS } from "../services/symbolConfig";
import { useAudio } from "../hooks/useAudio"; 

// 🎯 Game Config
const START_BALANCE = 1000;
const DEFAULT_BET = 50;
const SYMBOL_HEIGHT = 50;
const SPIN_DURATION = 2000; 
const REEL_COUNT = 3;

interface GameContextType {
  balance: number;
  bet: number;
  winnings: number;
  spinning: boolean;
  results: number[];  // indexes of stopped symbols
  offsets: number[];  // pixel offsets for UI
  setBet: (value: number) => void;
  spinReels: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(START_BALANCE);
  const [bet, setBet] = useState(DEFAULT_BET);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState<number[]>(Array(REEL_COUNT).fill(0));
  const [offsets, setOffsets] = useState<number[]>(Array(REEL_COUNT).fill(0));

  const { playSound } = useAudio(); // 🎵 use sound system

  const calculateWinnings = (resultIndices: number[]): number => {
    const [a, b, c] = resultIndices;
    if (a === b && b === c) {
      const symbol = SYMBOLS[a];
      return bet * symbol.multiplier;
    }
    return 0;
  };

  // --- Spin reels ---
  const spinReels = React.useCallback(() => {
    if (balance < bet || spinning) return;

    playSound("spin.mp3"); // 🎵 play spin sound

    // Deduct bet, reset win
    setBalance((b) => b - bet);
    setWinnings(0);
    setSpinning(true);

    // Step 1: Random results for all reels
    const newResults = Array.from({ length: REEL_COUNT }, () =>
      Math.floor(Math.random() * SYMBOLS.length)
    );
    setResults(newResults);

    // Step 2: Stop each reel with staggered timing
    newResults.forEach((symbolIndex, reelIndex) => {
      const reelDelay = 600 * reelIndex; // delay between reels stopping
      setTimeout(() => {
        setOffsets((prev) => {
          const updated = [...prev];
          updated[reelIndex] = symbolIndex * SYMBOL_HEIGHT;
          return updated;
        });

        // Last reel => evaluate winnings
        if (reelIndex === REEL_COUNT - 1) {
          const winAmount = calculateWinnings(newResults);
          if (winAmount > 0) {
            playSound("win.mp3"); // 🎵 win sound
            setWinnings(winAmount);
            setBalance((b) => b + winAmount);
          } else {
            playSound("lose.mp3"); // 🎵 lose sound
          }
          setSpinning(false);
        }
      }, SPIN_DURATION + reelDelay);
    });
  }, [balance, bet, spinning, playSound]);

  // --- Reset game ---
  const resetGame = React.useCallback(() => {
    playSound("restart.mp3"); // 🎵 restart sound
    setBalance(START_BALANCE);
    setBet(DEFAULT_BET);
    setWinnings(0);
    setSpinning(false);
    setResults(Array(REEL_COUNT).fill(0));
    setOffsets(Array(REEL_COUNT).fill(0));
  }, [playSound]);

  // --- Context Value ---
  const contextValue = React.useMemo(
    () => ({
      balance,
      bet,
      winnings,
      spinning,
      results,
      offsets,
      setBet,
      spinReels,
      resetGame,
    }),
    [balance, bet, winnings, spinning, results, offsets, spinReels, resetGame]
  );

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

// ---------------------------
// 🎯 Hook
// ---------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
