import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import { PlayerService } from "./services/PlayerService";
import { LocalStorageService } from "./services/LocalStorageService";
import { useEffect, useState } from "react";

function App() {
  const navigate = useNavigate();
  const [lastUsedPlayer, setLastUsedPlayer] = useState<string | null>(null);
  
  useEffect(() => {
    const storageService = new LocalStorageService();
    const playerService = new PlayerService(storageService);
    const lastPlayer = playerService.getLastUsedPlayer();
    setLastUsedPlayer(lastPlayer?.id || null);
  }, []);
  
  const handleContinueQuest = () => {
    if (lastUsedPlayer) {
      navigate(`/player/${lastUsedPlayer}`);
    } else {
      navigate("/continue");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "var(--space-m)",
      }}
    >
      <img
        src="/dropQuest/drop-quest-main-logo.png"
        alt="DropQuest Logo"
        style={{
          maxHeight: "60vh",
          maxWidth: "70vw",
          width: "auto",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      />
      <p style={{ textAlign: "center", margin: "var(--space-s) 0" }}>
        Track your grind, celebrate your drops
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "var(--space-s)",
          alignItems: "center",
          width: "90vw",
          maxWidth: "600px",
        }}
      >
        <Button 
          onClick={() => navigate("/new-player")} 
          style={{ flex: 1 }}
          variant="primary"
          size="large"
        >
          Create new player
        </Button>
        <Button 
          onClick={handleContinueQuest} 
          style={{ flex: 1 }}
          variant="primary"
          size="large"
        >
          Continue quest
        </Button>
      </div>
      
      <div style={{ marginTop: "var(--space-m)" }}>
        <Button 
          onClick={() => navigate("/settings")}
          variant="muted"
          size="small"
        >
          Settings
        </Button>
      </div>
    </div>
  );
}

export default App;
