import { useState } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";

function useSetRarity() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | BackendError | null>(null);

  const setRarity = async (itemId: string, rarity: number) => {
    setLoading(true);
    setError(null);

    const requestBody = { itemId: itemId, rarity: rarity };

    try {
      await fetchWithErrorHandling("/api/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      return true;
    } catch (error) {
      setError(error as BackendError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { setRarity, loading, error };
}

export default useSetRarity;
