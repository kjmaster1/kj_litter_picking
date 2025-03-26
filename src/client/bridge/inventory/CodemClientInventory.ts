import {ClientInventory} from "./ClientInventory";
import {ClientFramework} from "../framework/ClientFramework";


export class CodemClientInventory extends ClientInventory {

  getPlayerInventory(framework?: ClientFramework): unknown {
    return exports[this.name].GetClientPlayerInventory()
  }

  getItemData(item: string, framework?: ClientFramework): unknown {
    const items = exports[this.name].GetItemList()
    if (!items.length) return
    return items[item]
  }
}
