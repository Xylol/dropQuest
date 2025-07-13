import { Player } from "../types/Player";
import Button from "./Button";

interface PlayerHeaderProps {
  player: Player;
  onDeletePlayer: () => void;
}

function PlayerHeader({ player, onDeletePlayer }: PlayerHeaderProps) {
  const handleDeleteClick = () => {
    if (
      confirm(
        "Are you sure you want to delete this player and all their items? This action cannot be undone."
      )
    ) {
      onDeletePlayer();
    }
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
      <h1 style={{ fontSize: "var(--font-size-xxl)", margin: 0 }}>
        Player Dashboard
      </h1>
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