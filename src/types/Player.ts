import { Item } from "./Item";

export type Player = {
  id: string;
  createdAt: string; // Using string for frontend compatibility
  foundItemsCount: number;
  heroName?: string; // Optional hero name
  items: Item[]; // Array of full Item objects with calculated fields
  luck?: number; // Calculated player luck
  lastUsedAt?: string; // Track when player was last accessed
};
