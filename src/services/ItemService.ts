import { Item } from "../types/Item";
import { LocalStorageService } from "./LocalStorageService";

function generateId(): string {
  return crypto.randomUUID();
}

export function calculateAchievementText(
  runs: number,
  rarity: number
): string | null {
  const ratio = runs / rarity;

  if (ratio >= 8) {
    return "the balance of the universe is at stake, you truly earned it by now, we have nothing more to say...";
  }
  if (ratio >= 7) {
    return "the mightiest out of thousands of grinds is truly yours...";
  }
  if (ratio >= 6) {
    return "... goru mesork darma zurgu larach...";
  }
  if (ratio >= 5) {
    return "eternity does no longer frighten you...";
  }
  if (ratio >= 4.5) {
    return "truly for some nothing is written unless they writ it themselves...";
  }
  if (ratio >= 4) {
    return "acolyte of drop, whisper of hope, thunder of fury, unstoppable...";
  }
  if (ratio >= 3) {
    return "you thought you earned that message we skipped too? The persistance is admirable...";
  }
  if (ratio >= 2) {
    return "whispers... grumbling.... sounds distant, far and close, oh you better be prepared....";
  }
  if (ratio >= 1.5) {
    return "The people talk, the songs where made...";
  }
  if (ratio >= 1) {
    return "Most believe they have earned it by now...";
  }
  if (ratio >= 0.2) {
    return "It feels like the mechanics aren't that hard...";
  }
  if (ratio >= 0.1) {
    return "Trying things, I see...";
  }

  return null;
}

export function calculateItemLuck(runs: number, rarity: number): number {
  if (runs === 0 || rarity === 0) {
    return 0;
  }
  return rarity / runs;
}

export class ItemService {
  private readonly ITEMS_KEY = "items";

  constructor(private storageService: LocalStorageService) {}

  createItem(inputName: string, playerId: string): Item {
    const item: Item = {
      id: generateId(),
      name: inputName,
      numberOfRuns: 0,
      createdAt: new Date().toISOString(),
      playerId: playerId,
    };

    const items = this.getAllItems();
    items.push(item);
    this.storageService.save(this.ITEMS_KEY, items);

    return item;
  }

  getAllItems(): Item[] {
    return this.storageService.get<Item[]>(this.ITEMS_KEY) || [];
  }

  getItemsByPlayerId(playerId: string): Item[] {
    const items = this.getAllItems();
    return items.filter((item) => item.playerId && item.playerId === playerId);
  }

  getItemById(id: string): Item | null {
    const items = this.getAllItems();
    const item = items.find((item) => item.id === id) || null;
    return item;
  }

  updateItem(id: string, updates: Partial<Item>): Item | undefined {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return undefined;
    }

    const updatedItem = { ...items[itemIndex], ...updates };
    items[itemIndex] = updatedItem;
    this.storageService.save(this.ITEMS_KEY, items);
    return updatedItem;
  }

  addRunsToItem(id: string, runsToAdd: number): Item | null {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return null;
    }
    const currentRuns = items[itemIndex].numberOfRuns || 0;
    const newTotalRuns = currentRuns + runsToAdd;

    let achievementText = items[itemIndex].achievementText || null;
    if (items[itemIndex].rarity) {
      achievementText = calculateAchievementText(
        newTotalRuns,
        items[itemIndex].rarity
      );
    }

    items[itemIndex] = {
      ...items[itemIndex],
      numberOfRuns: newTotalRuns,
      achievementText: achievementText,
    };
    this.storageService.save(this.ITEMS_KEY, items);
    return items[itemIndex];
  }

  setRarity(id: string, rarity: number): Item | null {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    items[itemIndex] = {
      ...items[itemIndex],
      rarity: rarity,
    };
    this.storageService.save(this.ITEMS_KEY, items);
    return items[itemIndex];
  }

  updateDate(id: string, date: string): Item | null {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return null;
    }
    items[itemIndex] = {
      ...items[itemIndex],
      createdAt: new Date(date).toISOString(),
    };
    this.storageService.save(this.ITEMS_KEY, items);
    return items[itemIndex];
  }

  updateTotalRuns(id: string, totalRuns: number): Item | null {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return null;
    }

    items[itemIndex] = {
      ...items[itemIndex],
      numberOfRuns: totalRuns,
    };
    this.storageService.save(this.ITEMS_KEY, items);
    return items[itemIndex];
  }

  deleteItem(id: string): void {
    const items = this.getAllItems();
    const updatedItems = items.filter((item) => item.id !== id);
    this.storageService.save(this.ITEMS_KEY, updatedItems);
  }

  updateItemName(id: string, name: string): Item | undefined {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return undefined;
    }

    const updatedItem = { ...items[itemIndex], name };
    items[itemIndex] = updatedItem;
    this.storageService.save(this.ITEMS_KEY, items);
    return updatedItem;
  }

  markAsFound(id: string, found: boolean): Item | null {
    const items = this.getAllItems();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return null;
    }

    items[itemIndex] = {
      ...items[itemIndex],
      found: found,
    };

    this.storageService.save(this.ITEMS_KEY, items);
    return items[itemIndex];
  }
}
