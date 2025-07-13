import type { MockResponse } from "../types/api";

import { ItemService } from "./ItemService";
import { ItemValidationService } from "./itemValidation";
import { LocalStorageService } from "./LocalStorageService";
import { PlayerService } from "./PlayerService";
import { isValidUUID } from "./validation";

function createResponse(status: number, data: any): MockResponse {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    async json() {
      return data;
    },
  };
}

function sendError(
  status: number,
  error: string,
  code?: string,
  details?: any
): MockResponse {
  const errObj: any = { error };
  if (code) errObj.code = code;
  if (details) errObj.details = details;
  return createResponse(status, errObj);
}

export class LocalBackendService {
  private storage: LocalStorageService;
  private itemService: ItemService;
  private playerService: PlayerService;

  constructor() {
    this.storage = new LocalStorageService();
    this.itemService = new ItemService(this.storage);
    this.playerService = new PlayerService(this.storage);
  }

  async handleRequest(
    method: string,
    url: string,
    body?: any
  ): Promise<MockResponse> {
    try {
      const urlObj = new URL(url, "http://localhost");
      const path = urlObj.pathname;
      const query = urlObj.searchParams;

      switch (method) {
        case "GET":
          return this.handleGet(path, query);
        case "POST":
          return this.handlePost(path, body);
        case "PATCH":
          return this.handlePatch(path, body);
        case "DELETE":
          return this.handleDelete(path);
        default:
          return sendError(405, `Method ${method} not allowed`);
      }
    } catch (error) {
      return sendError(500, "Internal server error");
    }
  }

  private handleGet(path: string, query: URLSearchParams): MockResponse {
    if (path === "/api/players") {
      const players = this.playerService.getAllPlayers();
      return createResponse(200, players);
    }

    if (path === "/api/items") {
      const playerId = query.get("playerId");
      if (playerId && typeof playerId === "string" && playerId.trim() !== "") {
        const filteredItems = this.itemService.getItemsByPlayerId(playerId);
        return createResponse(200, filteredItems);
      } else {
        return createResponse(200, []);
      }
    }

    const itemMatch = path.match(/^\/api\/items\/(.+)$/);
    if (itemMatch) {
      const id = itemMatch[1];
      if (!id) {
        return sendError(400, "Item ID is required");
      }
      const item = this.itemService.getItemById(id);
      if (!item) {
        return sendError(404, "Item not found");
      }
      return createResponse(200, item);
    }

    const playerMatch = path.match(/^\/api\/player\/(.+)$/);
    if (playerMatch) {
      const id = playerMatch[1];
      const player = this.playerService.getPlayerById(id);
      if (!player) {
        return sendError(404, "Player not found");
      }

      const items = this.itemService.getItemsByPlayerId(id);
      const experience = this.playerService.calculatePlayerExperience(items);

      const playerWithItems = {
        ...player,
        items: items,
        experience: experience,
      };

      return createResponse(200, playerWithItems);
    }

    return sendError(404, "Not found");
  }

  private handlePost(path: string, body: any): MockResponse {
    if (path === "/api/items") {
      const validation = ItemValidationService.validateCreateItemRequest(body);
      if (!validation.isValid) {
        return sendError(400, validation.error!);
      }

      const newItem = this.itemService.createItem(body.name, body.playerId);
      return createResponse(201, newItem);
    }

    if (path === "/api/players") {
      const newPlayer = this.playerService.createPlayer();
      return createResponse(201, newPlayer);
    }

    return sendError(404, "Not found");
  }

  private handlePatch(path: string, body: any): MockResponse {
    if (path === "/api/items") {
      const { itemId, ...updates } = body;

      if (!isValidUUID(itemId)) {
        return sendError(400, "Invalid item ID format");
      }

      if (updates.name !== undefined) {
        if (!updates.name || updates.name.trim().length === 0) {
          return sendError(400, "Name cannot be empty.");
        }
      }

      if (updates.numberOfRuns !== undefined) {
        if (typeof updates.numberOfRuns !== "number") {
          return sendError(400, "Runs must be a number");
        }
        if (!Number.isInteger(updates.numberOfRuns)) {
          return sendError(400, "Runs must be a whole number");
        }
        if (updates.numberOfRuns < 0) {
          return sendError(400, "Runs cannot be negative");
        }
        if (updates.numberOfRuns > 100000) {
          return sendError(400, "Runs cannot exceed 100,000");
        }
      }

      if (updates.rarity !== undefined) {
        if (typeof updates.rarity !== "number") {
          return sendError(400, "Rarity must be a number");
        }
        if (!Number.isInteger(updates.rarity)) {
          return sendError(400, "Rarity must be a whole number");
        }
        if (updates.rarity <= 0) {
          return sendError(400, "Rarity must be greater than 0");
        }
        if (updates.rarity > 1000000) {
          return sendError(400, "Rarity cannot exceed 1,000,000");
        }
      }

      let updatedItem: any;

      if (updates.numberOfRuns !== undefined) {
        const currentItem = this.itemService.getItemById(itemId);
        if (!currentItem) {
          return sendError(404, "Item not found.");
        }

        const currentRuns = currentItem.numberOfRuns || 0;
        const newRuns = updates.numberOfRuns;

        if (newRuns > currentRuns) {
          const runsToAdd = newRuns - currentRuns;
          updatedItem = this.itemService.addRunsToItem(itemId, runsToAdd);
        } else {
          updatedItem = this.itemService.updateTotalRuns(itemId, newRuns);
        }
      } else {
        updatedItem = this.itemService.updateItem(itemId, updates);
      }

      if (!updatedItem) {
        return sendError(404, "Item not found.");
      }

      return createResponse(200, updatedItem);
    }

    if (path === "/api/items/found") {
      const validation = ItemValidationService.validateMarkAsFoundRequest(body);
      if (!validation.isValid) {
        return sendError(400, validation.error!);
      }

      const updatedItem = this.itemService.markAsFound(body.itemId, body.found);
      if (!updatedItem) {
        return sendError(404, "Item not found");
      }
      return createResponse(200, updatedItem);
    }

    const heroNameMatch = path.match(/^\/api\/player\/(.+)\/hero-name$/);
    if (heroNameMatch) {
      const id = heroNameMatch[1];
      const { heroName } = body;

      if (!heroName || typeof heroName !== "string") {
        return sendError(400, "Hero name is required");
      }

      const updatedPlayer = this.playerService.updatePlayerHeroName(
        id,
        heroName
      );
      if (!updatedPlayer) {
        return sendError(404, "Player not found");
      }

      return createResponse(200, updatedPlayer);
    }

    return sendError(404, "Not found");
  }

  private handleDelete(path: string): MockResponse {
    const itemMatch = path.match(/^\/api\/items\/(.+)$/);
    if (itemMatch) {
      const id = itemMatch[1];
      if (!id) {
        return sendError(400, "Item ID is required");
      }
      if (!isValidUUID(id)) {
        return sendError(400, "Invalid item ID format");
      }
      const item = this.itemService.getItemById(id);
      if (!item) {
        return sendError(404, "Item not found");
      }
      this.itemService.deleteItem(id);
      return createResponse(200, { message: "Item deleted successfully" });
    }

    const playerMatch = path.match(/^\/api\/player\/(.+)$/);
    if (playerMatch) {
      const id = playerMatch[1];
      const player = this.playerService.getPlayerById(id);
      if (!player) {
        return sendError(404, "Player not found");
      }
      this.playerService.deletePlayer(id);
      return createResponse(200, { message: "Player deleted successfully" });
    }

    return sendError(404, "Not found");
  }
}
