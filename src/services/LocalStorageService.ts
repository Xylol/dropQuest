export class LocalStorageService {
  private readonly prefix: string;

  constructor() {
    this.prefix = this.generateUrlBasedPrefix();
  }

  /**
   * Generate a prefix based on current URL hash for environment separation
   */
  private generateUrlBasedPrefix(): string {
    if (typeof window === "undefined") {
      return "dropquest-default-";
    }

    const url = `${window.location.protocol}//${window.location.host}`;
    const hash = this.simpleHash(url);
    return `dropquest-${hash}-`;
  }

  /**
   * Simple hash function for URL
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }

  save(key: string, data: unknown): void {
    const prefixedKey = this.prefix + key;

    try {
      const serializedData = JSON.stringify(data);

      const isNewItem = !localStorage.getItem(prefixedKey);
      if (isNewItem && this.getStorageSize() >= 4 * 1024 * 1024) {
        throw new Error(
          "Storage is full. Please delete some items to create new ones."
        );
      }

      localStorage.setItem(prefixedKey, serializedData);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Storage is full")) {
        throw error;
      }
      throw new Error("Failed to save data");
    }
  }

  /**
   * Get the size of our app's data in localStorage (in bytes)
   */
  getStorageSize(): number {
    const allData = this.getAll();
    const serialized = JSON.stringify(allData);
    return new Blob([serialized]).size;
  }

  get<T>(key: string): T | null {
    const prefixedKey = this.prefix + key;
    try {
      const rawData = localStorage.getItem(prefixedKey);
      return rawData ? JSON.parse(rawData) : null;
    } catch {
      return null;
    }
  }

  getAll(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const prefixLength = this.prefix.length;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const unprefixedKey = key.substring(prefixLength);
        const value = this.get(unprefixedKey);
        if (value !== null) {
          result[unprefixedKey] = value;
        }
      }
    }

    return result;
  }

  remove(key: string): void {
    const prefixedKey = this.prefix + key;
    localStorage.removeItem(prefixedKey);
  }

  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}
