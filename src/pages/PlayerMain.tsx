import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import type { Item } from "../types/Item";
import type { Player } from "../types/Player";
import type { BackendError } from "../utils/errorUtils";

import { isValidUUID } from "../services/validation";

import useMarkAsFound from "../hooks/useMarkAsFound";
import { usePlayerData } from "../hooks/usePlayerData";

import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import ContinuePlayerForm from "../components/ContinuePlayerForm";
import ErrorState from "../components/ErrorState";
import ItemsSection from "../components/ItemsSection";
import LoadingState from "../components/LoadingState";
import NotFoundState from "../components/NotFoundState";
import PlayerHeader from "../components/PlayerHeader";
import PlayerStats from "../components/PlayerStats";

import { fetchWithErrorHandling } from "../utils/errorUtils";

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
} as const;

const ERROR_MESSAGES = {
  PLAYER_NOT_FOUND: "Player not found",
  FETCH_FAILED: "Failed to fetch player data",
  NETWORK_ERROR: "Something went wrong when fetching player data",
  INVALID_ID: "Invalid player ID",
} as const;




function PlayerMain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { player, items, loading, error, refetchPlayerData } = usePlayerData(id);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
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

  const handleContinuePlayer = async (playerId: string): Promise<void> => {
    if (!isValidUUID(playerId)) {
      throw new Error("Invalid UUID format");
    }

    try {
      await fetchWithErrorHandling<Player>(`/api/player/${playerId}`);
      navigate(`/player/${playerId}`);
    } catch (error) {
      throw error; // Re-throw to trigger error feedback
    }
  };

  const copyPlayerId = async (): Promise<void> => {
    if (!player) return;

    try {
      await navigator.clipboard.writeText(player.id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
    }
  };

  const copyFullUrl = async (): Promise<void> => {
    try {
      const fullUrl = window.location.href;
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
    }
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
