import { useState } from "react";
import { fetchWithErrorHandling, BackendError } from "../utils/errorUtils";

function useUpdateDate() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | BackendError | null>(null);

  const updateDate = async (itemId: string, date: string) => {
    setLoading(true);
    setError(null);

    const requestBody = { itemId: itemId, createdAt: date };

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

  return { updateDate, loading, error };
}

export default useUpdateDate;
