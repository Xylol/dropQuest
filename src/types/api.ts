/**
 * API request and response types used throughout the application
 */

import { Item } from './Item';
import { Player } from './Player';

export interface MockResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  json(): Promise<any>;
}

export interface CreateItemRequest {
  name: string;
  playerId: string;
}

export interface UpdateItemRequest {
  itemId: string;
  name?: string;
  numberOfRuns?: number;
  rarity?: number;
  createdAt?: string;
}

export interface MarkAsFoundRequest {
  itemId: string;
  found: boolean;
}

export interface SetRarityRequest {
  itemId: string;
  rarity: number;
}

export interface AddRunsRequest {
  itemId: string;
  numberOfRuns: number;
}

export interface UpdateDateRequest {
  itemId: string;
  createdAt: string;
}

export interface UpdateHeroNameRequest {
  heroName: string;
}

export interface ExportData {
  players: any[];
  items: any[];
  version: string;
  exportDate: string;
  appName: string;
}

export interface ImportResult {
  success: boolean;
  error?: string;
  playersImported?: number;
  itemsImported?: number;
}

export interface ItemResponse extends Item {
  achievementText?: string | null;
}

export interface PlayerResponse extends Player {
  items: ItemResponse[];
  foundItemsCount: number;
  luck?: number;
}

export interface DeleteResponse {
  message: string;
}