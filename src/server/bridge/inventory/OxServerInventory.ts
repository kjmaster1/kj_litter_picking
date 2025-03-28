import {ServerInventory} from "./ServerInventory";

export class OxServerInventory extends ServerInventory {
  getItemCount(source: number, item: string): number {
    return exports[this.name].Search(source, "count", item) as number || 0;
  }

  addItem(source: number, item: string, count: number, metadata?: Record<string, unknown>): void {
    exports[this.name].AddItem(source, item, count, metadata);
  }

  getDurabilityType(): "quality" | "durability" {
    return 'durability';
  }


  getMetadata(source: number, item: string): undefined | any {
    const data = exports[this.name].Search(source, 'slots', item)
    console.log(data);
    if (!data || data.length === 0) {
      return undefined;
    }
    return data[0].metadata;
  }


  setMetadata(source: number, item: string, metaType: string, metaValue: string | boolean | number) {
    const data = exports[this.name].Search(source, 'slots', item)
    if (!data || data.length === 0) return;
    const metadata = data[0].metadata;
    metadata[metaType] = metaValue;
    exports[this.name].SetMetadata(source, data[0].slot, data[0].metadata);
  }
}
