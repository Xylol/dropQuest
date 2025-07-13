import { useState } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";

function usePostItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | BackendError | null>(null);

  const postItem = async (name: string, playerId: string) => {
    setLoading(true);
    setError(null);

    const requestBody = { name: name, playerId: playerId };

    try {
      await fetchWithErrorHandling("/api/items", {
        method: "POST",
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

  return { postItem, loading, error };
}

export default usePostItem;
