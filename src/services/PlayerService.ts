import { Player } from "../types/Player";
import { LocalStorageService } from "./LocalStorageService";
import { Item } from "../types/Item";
import { calculateItemLuck } from "./ItemService";

function generateId(): string {
  return crypto.randomUUID();
}

export function calculatePlayerLuck(items: Item[]): number {
  if (items.length === 0) {
    return 0;
  }

  let totalWeightedLuck = 0;
  let totalWeight = 0;

  for (const item of items) {
    if (
      item.rarity &&
      item.numberOfRuns &&
      item.rarity > 0 &&
      item.numberOfRuns > 0
    ) {
      const itemLuck = calculateItemLuck(item.numberOfRuns, item.rarity);
      totalWeightedLuck += itemLuck * item.rarity;
      totalWeight += item.rarity;
    }
  }

  if (totalWeight === 0) {
    return 0;
  }

  return totalWeightedLuck / totalWeight;
}

export class PlayerService {
  private readonly PLAYERS_KEY = "players";

  constructor(private storageService: LocalStorageService) {}

  createPlayer(): Player {
    const player: Player = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      foundItemsCount: 0,
      items: [],
    };

    const players = this.getAllPlayers();
    players.push(player);
    this.storageService.save(this.PLAYERS_KEY, players);

    return player;
  }

  getAllPlayers(): Player[] {
    return this.storageService.get<Player[]>(this.PLAYERS_KEY) || [];
  }

  getPlayerById(id: string): Player | null {
    const players = this.getAllPlayers();
    return players.find((player) => player.id === id) || null;
  }

  updatePlayerFoundItemsCounter(
    playerId: string,
    foundItemsCount: number
  ): Player | null {
    const players = this.getAllPlayers();
    const playerIndex = players.findIndex((player) => player.id === playerId);

    if (playerIndex === -1) {
      return null;
    }

    players[playerIndex] = {
      ...players[playerIndex],
      foundItemsCount: foundItemsCount,
    };

    this.storageService.save(this.PLAYERS_KEY, players);
    return players[playerIndex];
  }

  updatePlayerHeroName(playerId: string, heroName: string): Player | null {
    const players = this.getAllPlayers();
    const playerIndex = players.findIndex((player) => player.id === playerId);

    if (playerIndex === -1) {
      return null;
    }

    players[playerIndex] = {
      ...players[playerIndex],
      heroName: heroName.trim() || undefined,
    };

    this.storageService.save(this.PLAYERS_KEY, players);
    return players[playerIndex];
  }

  getFoundItemsCount(items: Item[]): number {
    let foundItemsCount = 0;

    for (const item of items) {
      if (item.found) {
        foundItemsCount++;
      }
    }

    return foundItemsCount;
  }

  updateItem(id: string, updatedItemData: Partial<Player>): Player | null {
    const players = this.getAllPlayers();
    const playerIndex = players.findIndex((player) => player.id === id);

    if (playerIndex !== -1) {
      players[playerIndex] = {
        ...players[playerIndex],
        ...updatedItemData,
      };

      this.storageService.save(this.PLAYERS_KEY, players);
      return players[playerIndex];
    }

    return null;
  }

  deletePlayer(id: string): void {
    const players = this.getAllPlayers();
    const updatedPlayers = players.filter((player) => player.id !== id);
    this.storageService.save(this.PLAYERS_KEY, updatedPlayers);
  }
}
