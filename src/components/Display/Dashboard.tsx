import React from "react";
import { Box } from "@mui/material";
import Reel from "../Reels/Reel";
import { useGame } from "../../context/GameContext";
import BetControls from "../Controls/BetControls";
import GameLayout from "../GameLayout/GameLayout";

const Dashboard: React.FC = () => {
  const { spinning } = useGame();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: "100%",
      }}
    >
      {/* Game Layout (Header with balance, bet, winnings) */}
      <GameLayout />

      {/* Reels */}
      <Box
        sx={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
          overflow: "hidden",
          flexWrap: "wrap",
        }}
      >
        <Reel reelIndex={0} isSpinning={spinning} />
        <Reel reelIndex={1} isSpinning={spinning} />
        <Reel reelIndex={2} isSpinning={spinning} />
      </Box>

      {/* Bet Controls */}
      <BetControls />
    </Box>
  );
};

export default Dashboard;
