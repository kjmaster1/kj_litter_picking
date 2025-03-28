import {Inventory} from "@common/bridge/inventory/Inventory";
import {ClientFramework} from "../framework/ClientFramework";


export class ClientInventory extends Inventory {

  getDurabilityType(): 'quality' | 'durability' {
    return "quality"
  }

  getPlayerInventory(framework?: ClientFramework): unknown {
    console.error('^1[ERROR]: No valid path found to get player inventory, please seek support!')
    return undefined;
  }

  getItemData(item: string, framework?: ClientFramework): unknown {
    console.error('^1[ERROR]: No valid path found to get item data, please seek support!')
    return undefined;
  }

  hasItem(item:string, amount:number): boolean {
    return exports[this.name].HasItem(item, amount)
  }
}
