import {ServerInventory} from "./ServerInventory";
import {ServerFramework} from "../framework/ServerFramework";
export class CoreServerInventory extends ServerInventory {


  getItemCount(source: number, item: string): number {
    return exports[this.name].getItemCount(source, item) as number || 0
  }

  canCarry(source: number, item: string, count: number, framework?: ServerFramework): boolean {
    return true
  }

  addItem(source: number, item: string, count: number, metadata: Record<string, unknown>) {
    exports[this.name].addItem(source, item, count, metadata)
  }

  removeItem(source: number, item: string, count: number) {
    exports[this.name].removeItem(source, item, count)
  }

  getMetadata(source: number, item: string): undefined | any {
    const data = exports[this.name].GetItem(source, item)
    return data ? data.info : undefined
  }

  setMetadata(source: number, item: string, metaType: string, metaValue: string | boolean | number) {
    const itemData = exports[this.name].GetItem(source, item);
    if (!itemData) return;
    const slot = exports[this.name].getFirstSlotByItem(source, item);
    if (!slot) return;
    itemData.info[metaType] = metaValue;
    exports[this.name].setMetadata(source, slot, itemData.info)
  }
}
