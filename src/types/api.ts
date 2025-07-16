/**
 * API request and response types used throughout the application
 */

import { Item } from './Item';
import { Player } from './Player';

export interface MockResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  json(): Promise<unknown>;
}

export interface ExportData {
  players: Player[];
  items: Item[];
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