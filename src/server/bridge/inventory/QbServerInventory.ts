import {ServerInventory} from "./ServerInventory";
import {ServerFramework} from "../framework/ServerFramework";

export class QbServerInventory extends ServerInventory {

  canCarry(source: number, item: string, count: number, framework?: ServerFramework): boolean {
    return exports[this.name].CanAddItem(source, item, count) as boolean
  }
}
