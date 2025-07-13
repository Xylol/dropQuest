import { Item } from "../types/Item";
import { fetchWithErrorHandling } from "../utils/errorUtils";

async function useFetchItems(playerId: string): Promise<Item[]> {
  return fetchWithErrorHandling<Item[]>(`/api/items?playerId=${playerId}`);
}

export default useFetchItems;
