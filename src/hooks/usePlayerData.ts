import { useState, useEffect } from "react";
import { Player } from "../types/Player";
import { Item } from "../types/Item";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";
import { isValidUUID } from "../services/validation";

const ERROR_MESSAGES = {
  INVALID_ID: "Invalid player ID",
} as const;

interface UsePlayerDataReturn {
  player: Player | null;
  items: Item[];
  loading: boolean;
  error: string | BackendError | null;
  refetchPlayerData: () => Promise<void>;
}

export const usePlayerData = (id: string | undefined): UsePlayerDataReturn => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | BackendError | null>(null);

  const fetchPlayerData = async (): Promise<void> => {
    if (id && id.trim() !== "") {
      try {
        const playerData = await fetchWithErrorHandling<Player>(
          `/api/player/${id}`
        );
        setPlayer(playerData);
        setItems(playerData.items || []);
      } catch (error) {
        setError(error as BackendError);
        setPlayer(null);
        setItems([]);
      }
    }
  };

  useEffect(() => {
    if (id && id.trim() !== "") {
      if (!isValidUUID(id)) {
        setError(ERROR_MESSAGES.INVALID_ID);
        setLoading(false);
        setPlayer(null);
        setItems([]);
        return;
      }

      const fetchPlayer = async () => {
        setLoading(true);
        setError(null);
        try {
          const playerData = await fetchWithErrorHandling<Player>(
            `/api/player/${id}`
          );
          setPlayer(playerData);
          setItems(playerData.items || []);
        } catch (error) {
          setError(error as BackendError);
          setPlayer(null);
          setItems([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPlayer();
    } else {
      setError(ERROR_MESSAGES.INVALID_ID);
      setLoading(false);
      setPlayer(null);
      setItems([]);
    }
  }, [id]);

  return {
    player,
    items,
    loading,
    error,
    refetchPlayerData: fetchPlayerData,
  };
};