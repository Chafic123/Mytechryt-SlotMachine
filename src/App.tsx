import { GameProvider } from "./context/GameContext";
import Dashboard from "./components/Display/Dashboard";
import { Box } from "@mui/material";

function App() {
  return (
    <GameProvider>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 4,
          fontFamily: "Roboto, sans-serif",
          backgroundColor: "#121212",
          color: "#ffffff",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundImage: `url(./backgrounds/SlotBack.avif)`,
          paddingTop: 14,
        }}
      >
        <Dashboard />
      </Box>
    </GameProvider>
  );
}

export default App;