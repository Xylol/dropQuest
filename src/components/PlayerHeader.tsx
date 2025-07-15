import { Player } from "../types/Player";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface PlayerHeaderProps {
  player: Player;
  onDeletePlayer: () => void;
}

function PlayerHeader({ player: _player, onDeletePlayer }: PlayerHeaderProps) {
  const navigate = useNavigate();
  
  const handleDeleteClick = () => {
    if (
      confirm(
        "Are you sure you want to delete this player and all their items? This action cannot be undone."
      )
    ) {
      onDeletePlayer();
    }
  };

  const handleSwitchPlayer = () => {
    navigate("/continue");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "var(--space-m)",
      }}
    >
      <Button
        onClick={handleSwitchPlayer}
        variant="secondary"
      >
        Switch Player
      </Button>
      <div style={{ display: "flex", gap: "var(--space-s)" }}>
        <Button
          onClick={handleDeleteClick}
          variant="destructive"
        >
          Delete Player
        </Button>
      </div>
    </header>
  );
}

export default PlayerHeader;