import { Player } from "../types/Player";

/**
 * Sort players by lastUsedAt (most recent first), fallback to createdAt for older players
 */
export function sortPlayersByLastUsed(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const aTime = a.lastUsedAt || a.createdAt;
    const bTime = b.lastUsedAt || b.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });
}

/**
 * Get the most recently used player
 */
export function getMostRecentPlayer(players: Player[]): Player | null {
  if (players.length === 0) return null;
  const sorted = sortPlayersByLastUsed(players);
  return sorted[0];
}