import {Framework} from "@common/bridge/framework/Framework";
import { ServerInventory } from "../inventory/ServerInventory";

export class ServerFramework extends Framework {

  constructor(readonly name: string, readonly inventory: ServerInventory) {
    super(name, inventory);
  }

  getPlayer(source:number):unknown {
    return undefined;
  }

  getIdentifier(source:number): string | number {
    return undefined;
  }

  getName(source:number): string {
    return undefined;
  }

  getItemCount(source:number, item:string): number {
    if (this.inventory) {
      return this.inventory.getItemCount(source, item);
    }
    return 0;
  }

  convertMoneyType(type:string):string {
    return type;
  }

  getPlayerBalance(source:number, type:string):number {
    return 0;
  }

  addMoney(source:number, type:string, amount:number):void {}

  removeMoney(source:number, type:string, amount:number):void {}

  canCarry(source:number, item:string, count:number): boolean {
    if (this.inventory) {
      return this.inventory.canCarry(source, item, count, this);
    }
    return false;
  }

  addItem(source:number, item:string, count:number, metadata:Record<string, unknown>):void {
    if (this.inventory) {
      this.inventory.addItem(source, item, count, metadata);
    }
  }

  removeItem(source:number, item:string, count:number):void {
    if (this.inventory) {
      this.inventory.removeItem(source, item, count);
    }
  }

  getDurabilityType(): 'quality' | 'durability' {
    if (this.inventory) {
      return this.inventory.getDurabilityType();
    }
    return "quality"
  }

  getMetadata(source:number, item:string) {
    if (this.inventory) {
      return this.inventory.getMetadata(source, item);
    }
    return undefined;
  }

  setMetadata(source:number, item:string, metaType:string, metaValue:string | boolean | number):void {
    if (this.inventory) {
      return this.inventory.setMetadata(source, item, metaType, metaValue);
    }
  }
}
