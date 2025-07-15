import type { ExportData, ImportResult } from '../types/api';
import type { Player } from '../types/Player';
import type { Item } from '../types/Item';

import { LocalStorageService } from './LocalStorageService';

export class DataPortabilityService {
  private storage: LocalStorageService;

  constructor() {
    this.storage = new LocalStorageService();
  }

  /**
   * Export all user data to a JSON object
   */
  exportData(): ExportData {
    const players = this.storage.get<Player[]>('players') || [];
    const items = this.storage.get<Item[]>('items') || [];

    return {
      players,
      items,
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appName: 'DropQuest'
    };
  }

  /**
   * Download user data as a JSON file
   */
  downloadData(): void {
    const data = this.exportData();
    const jsonString = JSON.stringify(data, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dropquest-backup-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate imported data structure
   */
  private validateImportData(data: unknown): { valid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid file format - not a valid JSON object' };
    }

    const typedData = data as Record<string, unknown>;

    if (!typedData.appName || typedData.appName !== 'DropQuest') {
      return { valid: false, error: 'This file is not a DropQuest backup file' };
    }

    if (!typedData.version) {
      return { valid: false, error: 'Backup file is missing version information' };
    }

    if (!Array.isArray(typedData.players)) {
      return { valid: false, error: 'Invalid backup format - players data is corrupted' };
    }

    if (!Array.isArray(typedData.items)) {
      return { valid: false, error: 'Invalid backup format - items data is corrupted' };
    }

    for (const player of typedData.players) {
      if (!player.id || typeof player.id !== 'string') {
        return { valid: false, error: 'Invalid player data - missing or invalid ID' };
      }
      if (!player.createdAt || typeof player.createdAt !== 'string') {
        return { valid: false, error: 'Invalid player data - missing or invalid creation date' };
      }
    }

    for (const item of typedData.items) {
      if (!item.id || typeof item.id !== 'string') {
        return { valid: false, error: 'Invalid item data - missing or invalid ID' };
      }
      if (!item.name || typeof item.name !== 'string') {
        return { valid: false, error: 'Invalid item data - missing or invalid name' };
      }
      if (item.numberOfRuns !== undefined && typeof item.numberOfRuns !== 'number') {
        return { valid: false, error: 'Invalid item data - numberOfRuns must be a number' };
      }
    }

    return { valid: true };
  }

  importData(data: unknown, options: { replace?: boolean } = {}): ImportResult {
    const validation = this.validateImportData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    try {
      const { replace = false } = options;

      let finalPlayers = (data as ExportData).players;
      let finalItems = (data as ExportData).items;

      if (!replace) {
        const existingPlayers = this.storage.get<Player[]>('players') || [];
        const existingItems = this.storage.get<Item[]>('items') || [];

        const existingPlayerIds = new Set(existingPlayers.map(p => p.id));
        const existingItemIds = new Set(existingItems.map(i => i.id));

        const newPlayers = (data as ExportData).players.filter((p) => !existingPlayerIds.has(p.id));
        const newItems = (data as ExportData).items.filter((i) => !existingItemIds.has(i.id));

        finalPlayers = [...existingPlayers, ...newPlayers];
        finalItems = [...existingItems, ...newItems];
      }

      this.storage.save('players', finalPlayers);
      this.storage.save('items', finalItems);

      return {
        success: true,
        playersImported: replace ? (data as ExportData).players.length : (finalPlayers.length - (this.storage.get<Player[]>('players')?.length || 0)),
        itemsImported: replace ? (data as ExportData).items.length : (finalItems.length - (this.storage.get<Item[]>('items')?.length || 0))
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Import data from a file
   */
  importFromFile(file: File, options: { replace?: boolean } = {}): Promise<ImportResult> {
    return new Promise((resolve) => {
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        resolve({
          success: false,
          error: 'Please select a JSON file'
        });
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const data = JSON.parse(text);
          const result = this.importData(data, options);
          resolve(result);
        } catch {
          resolve({
            success: false,
            error: 'Invalid JSON file format'
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file'
        });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Clear all local data
   */
  clearAllData(): void {
    this.storage.clear();
  }

  /**
   * Get data summary for display
   */
  getDataSummary(): { players: number; items: number; totalSize: string } {
    const players = this.storage.get<Player[]>('players') || [];
    const items = this.storage.get<Item[]>('items') || [];
    
    const data = this.exportData();
    const sizeBytes = new Blob([JSON.stringify(data)]).size;
    const sizeKB = (sizeBytes / 1024).toFixed(1);
    
    return {
      players: players.length,
      items: items.length,
      totalSize: `${sizeKB} KB`
    };
  }
}