import { isValidUUID } from "./validation";
import { ValidationResult } from "../types/errors";

export class ItemValidationService {
  static validateItemId(itemId: string): ValidationResult {
    if (!itemId) {
      return { isValid: false, error: "Item ID is required" };
    }
    if (!isValidUUID(itemId)) {
      return { isValid: false, error: "Invalid item ID format" };
    }
    return { isValid: true };
  }

  static validatePlayerId(playerId: string): ValidationResult {
    if (!playerId) {
      return { isValid: false, error: "Player ID is required" };
    }
    if (!isValidUUID(playerId)) {
      return { isValid: false, error: "Invalid player ID format" };
    }
    return { isValid: true };
  }

  static validateItemName(name: string): ValidationResult {
    if (!name) {
      return { isValid: false, error: "Name is required" };
    }
    if (typeof name !== "string") {
      return { isValid: false, error: "Name must be a string" };
    }
    if (name.trim().length === 0) {
      return { isValid: false, error: "Name cannot be empty" };
    }
    if (name.length > 100) {
      return { isValid: false, error: "Name must be 100 characters or less" };
    }
    return { isValid: true };
  }

  static validateRuns(runs: unknown): ValidationResult {
    if (runs === undefined || runs === null) {
      return { isValid: false, error: "Runs is required" };
    }
    if (typeof runs !== "number") {
      return { isValid: false, error: "Runs must be a positive number" };
    }
    if (!Number.isInteger(runs)) {
      return { isValid: false, error: "Runs must be a positive number" };
    }
    if (runs < 0) {
      return { isValid: false, error: "Runs must be a positive number" };
    }
    if (runs > 1000000) {
      return { isValid: false, error: "Runs cannot exceed 1,000,000" };
    }
    return { isValid: true };
  }

  static validateRarity(rarity: unknown): ValidationResult {
    if (rarity === undefined || rarity === null) {
      return { isValid: false, error: "Rarity is required" };
    }
    if (typeof rarity !== "number") {
      return { isValid: false, error: "Rarity must be a positive number" };
    }
    if (!Number.isInteger(rarity)) {
      return { isValid: false, error: "Rarity must be a positive number" };
    }
    if (rarity <= 0) {
      return { isValid: false, error: "Rarity must be a positive number" };
    }
    if (rarity > 1000000) {
      return { isValid: false, error: "Rarity cannot exceed 1,000,000" };
    }
    return { isValid: true };
  }

  static validateDate(date: string): ValidationResult {
    if (!date) {
      return { isValid: false, error: "Date is required" };
    }
    if (typeof date !== "string") {
      return { isValid: false, error: "Date must be a valid date string" };
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return { isValid: false, error: "Date must be a valid date string" };
    }
    return { isValid: true };
  }

  static validateFound(found: unknown): ValidationResult {
    if (found === undefined || found === null) {
      return { isValid: false, error: "Found is required" };
    }
    if (typeof found !== "boolean") {
      return { isValid: false, error: "Found must be a boolean value" };
    }
    return { isValid: true };
  }

  static validateCreateItemRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const nameValidation = this.validateItemName(typedBody.name as string);
    if (!nameValidation.isValid) return nameValidation;

    const playerIdValidation = this.validatePlayerId(typedBody.playerId as string);
    if (!playerIdValidation.isValid) return playerIdValidation;

    return { isValid: true };
  }

  static validateUpdateNameRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const nameValidation = this.validateItemName(typedBody.name as string);
    if (!nameValidation.isValid) return nameValidation;

    return { isValid: true };
  }

  static validateAddRunsRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const runsValidation = this.validateRuns(typedBody.runs);
    if (!runsValidation.isValid) return runsValidation;

    return { isValid: true };
  }

  static validateSetRarityRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const rarityValidation = this.validateRarity(typedBody.rarity);
    if (!rarityValidation.isValid) return rarityValidation;

    return { isValid: true };
  }

  static validateUpdateDateRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const dateValidation = this.validateDate(typedBody.date as string);
    if (!dateValidation.isValid) return dateValidation;

    return { isValid: true };
  }

  static validateUpdateTotalRunsRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const runsValidation = this.validateRuns(typedBody.totalRuns);
    if (!runsValidation.isValid) return runsValidation;

    return { isValid: true };
  }

  static validateMarkAsFoundRequest(body: unknown): ValidationResult {
    const typedBody = body as Record<string, unknown>;
    const itemIdValidation = this.validateItemId(typedBody.itemId as string);
    if (!itemIdValidation.isValid) return itemIdValidation;

    const foundValidation = this.validateFound(typedBody.found);
    if (!foundValidation.isValid) return foundValidation;

    return { isValid: true };
  }
}