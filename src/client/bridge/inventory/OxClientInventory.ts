import {ClientInventory} from "./ClientInventory";
import {ClientFramework} from "../framework/ClientFramework";

export class OxClientInventory extends ClientInventory {
  getPlayerInventory(framework?: ClientFramework): unknown {
    return exports[this.name].GetPlayerItems()
  }

  getItemData(item:string, framework?: ClientFramework): unknown {
    return exports.ox_inventory.Items(item)
  }

  hasItem(item: string, amount: number): boolean {
    return exports[this.name].Search('count', item) >= amount
  }


  getDurabilityType(): "quality" | "durability" {
    return "durability"
  }
}
