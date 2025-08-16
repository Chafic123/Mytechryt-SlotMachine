// src/context/GameContext.tsx
import React, { createContext, useContext, useState } from "react";
import { SYMBOLS } from "../services/symbolConfig";

interface GameContextType {
  balance: number;
  bet: number;
  winnings: number;
  spinning: boolean;
  offsets: number[];
  setBet: (value: number) => void;
  spinReels: () => void;
resetGame: () => void;

}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(50);
  const [winnings, setWinnings] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [offsets, setOffsets] = useState([0, 0, 0]);

  const spinReels = React.useCallback(() => {
    if (balance < bet) return;

    setBalance((b) => b - bet);
    setWinnings(0);
    setSpinning(true);

    setTimeout(() => {
      // Stop reels
      setSpinning(false);

      const symbolHeight = 100;
      const results = [0, 1, 2].map(() =>
        Math.floor(Math.random() * SYMBOLS.length)
      );

      const newOffsets = results.map((r) => r * symbolHeight);
      setOffsets(newOffsets);

      if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = SYMBOLS[results[0]];
        const winAmount = bet * symbol.multiplier;
        setWinnings(winAmount);
        setBalance((b) => b + winAmount);
      }
    }, 3000);
  }, [balance, bet, setBalance, setWinnings, setSpinning, setOffsets]);

  const resetGame = React.useCallback(() => {
    setBalance(1000);
    setBet(50);
    setWinnings(0);
    setSpinning(false);
    setOffsets([0, 0, 0]);
  }, [setBalance, setBet, setWinnings, setSpinning, setOffsets]);

  const contextValue = React.useMemo(
    () => ({
      balance,
      bet,
      winnings,
      spinning,
      offsets,
      setBet,
      spinReels,
      resetGame,
    }),
    [balance, bet, winnings, spinning, offsets, setBet, spinReels, resetGame]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

// Custom hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
