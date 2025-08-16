import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useGame } from "../../context/GameContext";
import { styled } from "@mui/material/styles";

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  width: "90%",
  maxWidth: 800,
  height: 80,
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  background: `linear-gradient(to right, 
              rgba(0,0,0,0.6) 0%, 
              rgba(20,20,40,0.7) 50%, 
              rgba(0,0,0,0.6) 100%)`,
  borderRadius: 16,
  border: `1px solid ${theme.palette.warning.main}`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.3),
              inset 0 1px 1px rgba(255,255,255,0.1)`,
  position: "relative",
  overflow: "hidden",
}));

const ValueBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  minWidth: 120,
  borderRadius: 8,
  background: "rgba(0,0,0,0.3)",
  position: "relative",
  "&:not(:last-child)": {
    "&::after": {
      content: '""',
      position: "absolute",
      right: -16,
      top: "50%",
      transform: "translateY(-50%)",
      height: 40,
      width: 1,
      background: `linear-gradient(to bottom, 
                  transparent, 
                  ${theme.palette.warning.main}, 
                  transparent)`,
    },
  },
}));

const ValueLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.warning.main,
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: theme.spacing(0.5),
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: 22,
  fontWeight: 700,
  color: theme.palette.common.white,
  textShadow: `0 2px 4px rgba(0,0,0,0.5)`,
  fontFamily: "'Orbitron', sans-serif",
}));

const GameLayout: React.FC = () => {
  const { balance, bet, winnings } = useGame();
  const theme = useTheme();

  return (

    <DashboardContainer>
        
      <ValueBox>
        <ValueLabel>Balance</ValueLabel>
        <ValueText sx={{ color: theme.palette.success.light }}>
          ${balance.toLocaleString()}
        </ValueText>
      </ValueBox>
      
      <ValueBox>
        <ValueLabel>Bet</ValueLabel>
        <ValueText sx={{ color: theme.palette.warning.light }}>
          ${bet.toLocaleString()}
        </ValueText>
      </ValueBox>
      
      <ValueBox>
        <ValueLabel>Winnings</ValueLabel>
        <ValueText sx={{ 
          color: winnings > 0 ? theme.palette.success.main : theme.palette.common.white,
          animation: winnings > 0 ? "pulse 1.5s infinite" : "none"
        }}>
          ${winnings.toLocaleString()}
        </ValueText>
      </ValueBox>
    </DashboardContainer>
  );
};



export default GameLayout;