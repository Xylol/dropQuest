export interface Item {
  id: string;
  name: string;
  numberOfRuns: number;
  createdAt: string;
  playerId?: string;
  rarity?: number;
  achievementText?: string | null;
  found?: boolean;
}
