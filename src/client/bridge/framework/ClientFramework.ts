import {Framework} from "@common/bridge/framework/Framework";
import {ClientInventory} from "../inventory/ClientInventory";
import {cache} from "@overextended/ox_lib/client";

export class ClientFramework extends Framework {

  playerData: unknown
  playerLoaded: boolean

  constructor(readonly name: string, readonly inventory: ClientInventory) {
    super(name, inventory);
    this.playerData = undefined;
    this.playerLoaded = false;
  }

  initializeEvents(): ClientFramework {
    AddEventHandler('onResourceStart', (resourceName: string) => {
      if (GetCurrentResourceName() !== resourceName) return;
      this.playerData = this.getPlayerData()
      this.playerLoaded = true;
      TriggerEvent(`${cache.resource}:onPlayerLoaded`)
    })
    return this;
  }

  getPlayerData(): unknown {
    console.error('^1[ERROR]: No valid path found to get player data, please seek support!')
    return undefined;
  }

  getPlayerInventory(): unknown {
    if (this.inventory) {
      return this.inventory.getPlayerInventory()
    }
    console.error('^1[ERROR]: No valid path found to get player inventory, please seek support!')
    return undefined;
  }

  getItemData(item: string): unknown {
    if (this.inventory) {
      return this.inventory.getItemData(item, this)
    }
    console.error('^1[ERROR]: No valid path found to get item data, please seek support!')
    return undefined;
  }

  hasItem(item:string, amount:number): boolean {
    if (this.inventory) {
      return this.inventory.hasItem(item, amount)
    } else {
      const player = this.getPlayerData() as Record<string, any>
      if (!player) return false;
      const inventory = player.inventory
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
