
import { useParams, useNavigate } from "react-router-dom";

import useMarkAsFound from "../hooks/useMarkAsFound";
import { usePlayerData } from "../hooks/usePlayerData";

import BottomNav from "../components/BottomNav";
import ErrorState from "../components/ErrorState";
import ItemsSection from "../components/ItemsSection";
import LoadingState from "../components/LoadingState";
import NotFoundState from "../components/NotFoundState";
import PlayerHeader from "../components/PlayerHeader";
import PlayerStats from "../components/PlayerStats";




function PlayerMain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { player, items, loading, error, refetchPlayerData } = usePlayerData(id);
  const { markAsFound, loading: markLoading } = useMarkAsFound();




  const handleItemCreated = (): void => {
    refetchPlayerData();
  };

  const handleToggleFound = async (itemId: string, found: boolean): Promise<void> => {
    const success = await markAsFound(itemId, found);
    if (success) {
      refetchPlayerData();
    }
  };

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    });
    refetchPlayerData();
  };


  if (loading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        error={error}
        onBackToHome={() => navigate("/")}
      />
    );
  }

  if (!player) return <NotFoundState />;

  return (
    <div
      style={{
        padding: "var(--space-s)",
        paddingBottom: "4rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >

      <PlayerHeader
        player={player}
        onDeletePlayer={() => {
          fetch(`/api/player/${player.id}`, { method: "DELETE" }).then(
            () => navigate("/")
          );
        }}
      />

      <PlayerStats
        player={player}
        items={items}
        onHeroNameUpdated={refetchPlayerData}
      />

      {player && (
        <ItemsSection
          items={items}
          playerId={player.id}
          onItemCreated={handleItemCreated}
          onToggleFound={handleToggleFound}
          onDeleteItem={handleDeleteItem}
          isMarkingAsFound={markLoading}
        />
      )}

      <BottomNav />
    </div>
  );
}

export default PlayerMain;
