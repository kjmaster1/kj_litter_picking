import {ClientInventory} from "./ClientInventory";
import {ClientFramework} from "../framework/ClientFramework";


export class QsClientInventory extends ClientInventory {

  getPlayerInventory(framework?: ClientFramework): unknown {
    return exports[this.name].getUserInventory();
  }

  getItemData(item: string, framework?: ClientFramework): unknown {
    const items = exports[this.name].GetItemList()
    if (!items.length) return {};
    return items[item]
  }
}
