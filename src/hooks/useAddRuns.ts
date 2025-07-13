import { useState } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";

function useAddRuns() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | BackendError | null>(null);

  const addRuns = async (itemId: string, runsToAdd: number) => {
    setLoading(true);
    setError(null);

    try {
      const currentItemResponse = await fetch(`/api/items/${itemId}`);
      if (!currentItemResponse.ok) {
        throw new Error("Failed to get current item");
      }
      const currentItem = await currentItemResponse.json();
      const currentRuns = currentItem.numberOfRuns || 0;
      const newTotalRuns = currentRuns + runsToAdd;

      const requestBody = { itemId: itemId, numberOfRuns: newTotalRuns };

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

  return { addRuns, loading, error };
}

export default useAddRuns;
