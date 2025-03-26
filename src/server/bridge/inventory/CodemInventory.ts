import {ServerInventory} from "./ServerInventory";

export class CodemInventory extends ServerInventory {

  setMetadata(source: number, item: string, metaType: string, metaValue: string | boolean | number) {
    const itemData = exports[this.name].GetItemByName(source, item);
    if (!itemData) return;
    itemData.info[metaType] = metaValue;
    exports[this.name].SetItemMetadata(source, itemData.slot, itemData.info)
  }
}
