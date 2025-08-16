// /components/Controls/BetControls.tsx
import React, { useState } from "react";
import {
  Button,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import { useGame } from "../../context/GameContext";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const BetControls: React.FC = () => {
  const { balance, bet, setBet, spinning, spinReels, resetGame } = useGame();
  const [restarting, setRestarting] = useState(false);

  const minBet = 10;

  const increaseBet = () => {
    if (!spinning && balance >= bet + 10) setBet(bet + 10);
  };

  const decreaseBet = () => {
    if (!spinning && bet > minBet) setBet(bet - 10);
  };

  const setMinBet = () => {
    if (!spinning) setBet(minBet);
  };

  const maxBet = () => {
    if (!spinning) setBet(Math.min(balance, 1000));
  };

  const handleRestart = () => {
    if (!spinning) {
      setRestarting(true);
      resetGame();
      setTimeout(() => setRestarting(false), 1050);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        flexWrap="wrap" // allows items to move to next line
        justifyContent="center" // optional: center if wrapped
        sx={{
          padding: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 2,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Restart Game Button */}
        <Tooltip title="Restart Game">
          <IconButton
            color="warning"
            onClick={handleRestart}
            disabled={spinning}
            sx={{
              backgroundColor: "rgba(255, 165, 0, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 165, 0, 0.3)",
              },
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>

        {/* Bet Controls */}
        <Button
          variant="outlined"
          onClick={decreaseBet}
          disabled={spinning || bet <= minBet}
          sx={{ minWidth: 40 }}
        >
          -
        </Button>

        <Typography variant="h6" sx={{ minWidth: 60, textAlign: "center" }}>
          ${bet}
        </Typography>

        <Button
          variant="outlined"
          onClick={increaseBet}
          disabled={spinning || balance < bet + 10}
          sx={{ minWidth: 40 }}
        >
          +
        </Button>

        {/* Min Bet Button */}
        <Button
          variant="outlined"
          onClick={setMinBet}
          disabled={spinning || bet <= minBet}
          sx={{
            backgroundColor: "rgba(0, 255, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(0, 255, 0, 0.2)",
            },
          }}
        >
          Min
        </Button>

        {/* Max Bet Button */}
        <Button
          variant="outlined"
          onClick={maxBet}
          disabled={spinning || bet >= balance}
          sx={{
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            },
          }}
        >
          Max
        </Button>

        {/* Spin Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={spinReels}
          disabled={spinning || balance < bet}
          sx={{
            minWidth: 120,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          {spinning ? "Spinning..." : "Spin"}
        </Button>
      </Stack>

      {/* Restart Spinner Overlay */}
      {restarting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={80} thickness={4} color="warning" />
        </Box>
      )}
    </>
  );
};

export default BetControls;
