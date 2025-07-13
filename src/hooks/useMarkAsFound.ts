import { useState } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";

function useMarkAsFound() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | BackendError | null>(null);

  const markAsFound = async (itemId: string, found: boolean) => {
    setLoading(true);
    setError(null);

    const requestBody = { itemId: itemId, found: found };

    try {
      await fetchWithErrorHandling("/api/items/found", {
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

  return { markAsFound, loading, error };
}

export default useMarkAsFound;
