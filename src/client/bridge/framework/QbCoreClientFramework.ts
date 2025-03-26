import {ClientFramework} from "./ClientFramework";
import {cache} from "@overextended/ox_lib/client";


export class QbCoreClientFramework extends ClientFramework {

  QBCORE:any

  initializeEvents() : ClientFramework {
    super.initializeEvents();

    this.QBCORE = exports['qb-core'].GetCoreObject();

    AddEventHandler('QBCore:Client:OnPlayerLoaded', () => {
      this.playerData = this.getPlayerData();
      this.playerLoaded = true;
      TriggerEvent(`${cache.resource}:onPlayerLoaded`);
    })

    on('QBCore:Client:OnPlayerUnload', () => {
      this.playerData = undefined;
      this.playerLoaded = false;
    })
    return this;
  }

  getPlayerData(): unknown {
    return this.QBCORE.Functions.GetPlayerData();
  }


  getPlayerInventory(): unknown {
    if (this.inventory) return super.getPlayerInventory();
    return (this.getPlayerData() as any).items;
  }


  getItemData(item: string): unknown {
    if (this.inventory) return super.getItemData(item);
    return this.QBCORE.Shared.Items[item];
  }


  hasItem(item: string, amount: number): boolean {
    if (this.inventory) {
      return super.hasItem(item, amount)
    } else {
      const player = this.getPlayerData() as Record<string, any>
      if (!player) return false;
      const inventory = player.items
      if (!inventory) return false;
      for (const key in inventory) {
        if (inventory.hasOwnProperty(key)) {
          const itemData = inventory[key];
          if (itemData && itemData.name === item) {
            const count = itemData.amount || itemData.count || 0;
            return count >= amount
          }
        }
      }
      return false;
    }
  }
}
