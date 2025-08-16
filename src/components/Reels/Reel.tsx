import React, { useMemo, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { SYMBOLS } from "../../services/symbolConfig";

interface ReelProps {
  reelIndex: number;
  isSpinning: boolean;
  width?: number;
  height?: number;
}

const gloss = keyframes`
  0% { opacity: 0.4; transform: translateY(-60%) rotateX(60deg); }
  100% { opacity: 0.2; transform: translateY(160%) rotateX(60deg); }
`;

const spinLinear = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(var(--spinDistance)); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.7); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
`;

// Styled Components
const ReelFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "grid",
  placeItems: "center",
  borderRadius: 20,
  width: "var(--reelWidth)",
  height: "var(--viewportHeight)",
  padding: 6,
  background: `linear-gradient(145deg, 
    ${theme.palette.warning.light} 0%, 
    ${theme.palette.warning.main} 30%, 
    ${theme.palette.warning.dark} 100%)`,
  boxShadow: `0 12px 40px rgba(0,0,0,0.4), 
              inset 0 2px 1px rgba(255,255,255,0.3)`,
  overflow: "hidden",
  "&:hover": {
    animation: `${pulseGlow} 2s infinite ease-in-out`,
  },
}));

const InnerMask = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: `radial-gradient(150% 200% at 50% 0%, 
              rgba(255,255,255,0.1), 
              rgba(255,255,255,0.05) 40%, 
              rgba(0,0,0,0.4) 100%), 
              ${theme.palette.mode === "dark" ? "#0a0d14" : "#0c0f18"}`,
  boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1), 
              inset 0 -25px 50px rgba(0,0,0,0.7)`,
}));

const EdgeFadeTop = styled(Box)(() => ({
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 40,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0))",
  zIndex: 2,
}));

const EdgeFadeBottom = styled(EdgeFadeTop)({
  top: "unset",
  bottom: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
});

const GlossSheen = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05))",
  animation: `${gloss} 3.5s linear infinite`,
}));

const Strip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$spinning", 
})<{ $spinning: boolean }>(({ $spinning }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  willChange: "transform",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 8,
  padding: "12px 0",
  animation: $spinning ? `${spinLinear} var(--loopDuration) linear infinite` : "none",
}));


const Cell = styled(Box)(({ theme }) => ({
  height: "var(--symbolHeight)",
  width: "100%",
  borderRadius: 12,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg, rgba(45,50,70,0.9), rgba(30,35,50,0.95))"
      : "linear-gradient(180deg, rgba(245,248,255,0.95), rgba(235,240,255,0.96))",
  boxShadow: `inset 0 2px 1px rgba(255,255,255,0.3), 
              inset 0 -3px 8px rgba(0,0,0,0.4), 
              0 5px 12px rgba(0,0,0,0.4)`,
  display: "grid",
  placeItems: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))",
  },
}));

const Icon = styled("span")(() => ({
  fontSize: 42,
  lineHeight: 1,
  userSelect: "none",
  filter:
    "drop-shadow(0 2px 1px rgba(0,0,0,0.3)) drop-shadow(0 1px 0 rgba(255,255,255,0.6))",
  zIndex: 1,
}));

const Label = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  left: 0,
  right: 0,
  textAlign: "center",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[800],
  opacity: 0.9,
  textShadow: "0 1px 1px rgba(0,0,0,0.2)",
  zIndex: 1,
}));

const CornerAccent = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: 16,
  height: 16,
  borderRadius: 4,
  background: theme.palette.warning.main,
  opacity: 0.7,
  "&:nth-of-type(1)": { top: 8, left: 8 },
  "&:nth-of-type(2)": { top: 8, right: 8 },
  "&:nth-of-type(3)": { bottom: 8, left: 8 },
  "&:nth-of-type(4)": { bottom: 8, right: 8 },
}));

const Reel: React.FC<ReelProps> = ({ reelIndex, isSpinning, width = 120, height = 400 }) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const symbolHeight = height / 3; 
  const viewportHeight = height;
  const loopDurationMs = 2000;

  // Create enough symbols to fill the viewport and allow for spinning
  const stripSymbols = useMemo(() => {
    const visibleSymbols = Math.ceil(viewportHeight / symbolHeight) + 2;
    const repeatedSymbols = Array(visibleSymbols * 2).fill(null).map((_, i) => 
      SYMBOLS[i % SYMBOLS.length]
    );
    return repeatedSymbols;
  }, [viewportHeight]);

  const totalTravel = stripSymbols.length * symbolHeight;

  // Handle the stopping animation
  useEffect(() => {
    if (!isSpinning && stripRef.current) {
      // Calculate a random position that aligns with a symbol
      const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
      const targetPosition = randomIndex * symbolHeight;
      
      stripRef.current.style.transform = `translateY(-${targetPosition}px)`;
    }
  }, [isSpinning, symbolHeight]);

  return (
    <ReelFrame
      role="group"
      aria-roledescription="slot reel"
      aria-label={`Reel ${reelIndex + 1}`}
      sx={{
        "--reelWidth": `${width}px`,
        "--symbolHeight": `${symbolHeight}px`,
        "--viewportHeight": `${viewportHeight}px`,
        "--loopDuration": `${loopDurationMs}ms`,
        "--spinDistance": `${totalTravel}px`,
      } as React.CSSProperties}
    >
      <InnerMask>
        <CornerAccent />
        <CornerAccent />
        <CornerAccent />
        <CornerAccent />
        <Strip
          ref={stripRef}
          $spinning={isSpinning}
          sx={{
            transform: `translateY(${isSpinning ? 0 : Math.floor(Math.random() * SYMBOLS.length) * symbolHeight}px)`,
            transition: !isSpinning ? "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
          }}
        >
          {stripSymbols.map((symbol, i) => (
            <Cell key={`${symbol.id}-${i}`}>
              <Icon aria-hidden>{symbol.emoji}</Icon>
              <Label variant="caption">{}</Label>
            </Cell>
          ))}
        </Strip>
        <EdgeFadeTop />
        <EdgeFadeBottom />
        <GlossSheen aria-hidden />
      </InnerMask>
    </ReelFrame>
  );
};

export default Reel;