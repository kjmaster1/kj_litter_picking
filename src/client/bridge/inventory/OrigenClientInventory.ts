import {ClientInventory} from "./ClientInventory";
import {ClientFramework} from "../framework/ClientFramework";


export class OrigenClientInventory extends ClientInventory {

  getPlayerInventory(framework?: ClientFramework): unknown {
    return exports[this.name].GetInventory();
  }

  getItemData(item: string, framework?: ClientFramework): unknown {
    const items = exports['origen_inventory'].GetItems();
    if (!items.length) return undefined;
    return items[item];
  }
}
