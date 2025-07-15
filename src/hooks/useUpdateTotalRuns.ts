import { useState } from "react";

function useUpdateTotalRuns() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTotalRuns = async (itemId: string, totalRuns: number) => {
    setLoading(true);
    setError(null);

    const requestBody = { itemId: itemId, numberOfRuns: totalRuns };

    try {
      const response = await fetch("/api/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error("Failed to update total runs");
      }
    } catch {
      setError("Failed to update total runs");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateTotalRuns, loading, error };
}

export default useUpdateTotalRuns;
