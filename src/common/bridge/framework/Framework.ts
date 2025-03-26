import {Inventory} from "@common/bridge/inventory/Inventory";

export class Framework {

  constructor(readonly name: string, readonly inventory: Inventory) {
    this.name = name;
    this.inventory = inventory;
  }
}
