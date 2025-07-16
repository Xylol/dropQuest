import { ItemService } from "./ItemService";
import { LocalBackendService } from "./LocalBackendService";
import { LocalStorageService } from "./LocalStorageService";
import { PlayerService } from "./PlayerService";

export class ServiceContainer {
  private storage: LocalStorageService;
  private itemService: ItemService;
  private playerService: PlayerService;
  private backendService: LocalBackendService | null = null;

  constructor() {
    this.storage = new LocalStorageService();
    this.itemService = new ItemService(this.storage);
    this.playerService = new PlayerService(this.storage);
  }

  getBackendService(): LocalBackendService {
    if (!this.backendService) {
      this.backendService = new LocalBackendService(
        this.itemService,
        this.playerService
      );
    }
    return this.backendService;
  }

  getItemService(): ItemService {
    return this.itemService;
  }

  getPlayerService(): PlayerService {
    return this.playerService;
  }

  getStorage(): LocalStorageService {
    return this.storage;
  }
}