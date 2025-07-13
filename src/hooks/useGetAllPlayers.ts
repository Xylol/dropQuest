import { useState, useEffect } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";
import { Player } from "../types/Player";

function useGetAllPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | BackendError | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const playersData = await fetchWithErrorHandling<Player[]>('/api/players');
        setPlayers(playersData);
      } catch (error) {
        setError(error as BackendError);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const playersData = await fetchWithErrorHandling<Player[]>('/api/players');
      setPlayers(playersData);
    } catch (error) {
      setError(error as BackendError);
    } finally {
      setLoading(false);
    }
  };

  return { players, loading, error, refetch };
}

export default useGetAllPlayers;