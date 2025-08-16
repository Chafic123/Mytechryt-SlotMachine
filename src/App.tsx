import { GameProvider } from "./context/GameContext";
import Dashboard from "./components/Display/Dashboard";
import { Box } from "@mui/material";

function App() {
  return (
    <GameProvider>
      <Box
        sx={{
          minHeight: "87vh",
          width: "100%",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 6,
          fontFamily: "Roboto, sans-serif",
          backgroundColor: "#121212",
          color: "#ffffff",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundImage: `url(./backgrounds/SlotBack.jpeg)`,
          paddingTop: 10,
        }}
      >
        <Dashboard />
      </Box>
    </GameProvider>
  );
}

export default App;