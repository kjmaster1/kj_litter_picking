import {ServerFramework} from "./ServerFramework";
import {ServerInventory} from "../inventory/ServerInventory";

export interface Esx {
  GetPlayerFromId: (source: number) => unknown
}

export interface EsxPlayer {
  identifier: string;
  getName(): string;
  getInventoryItem(item:string): EsxItem
  getAccount(type:string): EsxAccount
  addAccountMoney(type:string, amount:number): void
  removeAccountMoney(type:string, amount:number): void
  canCarryItem(item:string, count:number): boolean
  addInventoryItem(item:string, count:number): void
  removeInventoryItem(item:string, count:number): void
}

export interface EsxItem {
  amount: number;
  count: number;
}

export interface EsxAccount {
  money: number;
}

export class EsxServerFramework extends ServerFramework {

  private ESX: Esx

  constructor(readonly inventory: ServerInventory) {
    super('esx', inventory);
    this.ESX = exports['es_extended'].getSharedObject()
  }

  getPlayer(source: number): unknown {
    return this.ESX.GetPlayerFromId(source);
  }

  getIdentifier(source: number): string | number {
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return undefined;
    return player.identifier as string;
  }

  getName(source: number): string {
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return 'Unknown';
    return player.getName()
  }


  getItemCount(source: number, item: string): number {
    if (this.inventory) return super.getItemCount(source, item);
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return 0;
    const itemData = player.getInventoryItem(item)
    if (!itemData) return 0;
    return itemData.amount || itemData.count || 0;
  }


  convertMoneyType(type: string): string {
    if (type === 'cash') return 'money'
    return super.convertMoneyType(type);
  }


  getPlayerBalance(source: number, type: string): number {
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return 0;
    return player.getAccount(this.convertMoneyType(type)).money
  }


  addMoney(source: number, type: string, amount: number) {
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return 0;
    player.addAccountMoney(this.convertMoneyType(type), amount);
  }

  removeMoney(source: number, type: string, amount: number) {
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return 0;
    player.removeAccountMoney(this.convertMoneyType(type), amount);
  }


  canCarry(source: number, item: string, count: number): boolean {
    if (this.inventory) return super.canCarry(source, item, count);
    const player = this.getPlayer(source) as EsxPlayer;
    if (!player) return false;
    return player.canCarryItem(item, count);
  }


  addItem(source: number, item: string, count: number, metadata: Record<string, unknown>) {
    if (this.inventory) {
      super.addItem(source, item, count, metadata);
    }
    else {
      const player = this.getPlayer(source) as EsxPlayer;
      if (!player) return 0;
      player.addInventoryItem(item, count)
    }
  }


  removeItem(source: number, item: string, count: number) {
    if (this.inventory) {
      super.removeItem(source, item, count);
    } else {
      const player = this.getPlayer(source) as EsxPlayer;
      if (!player) return 0;
      player.removeInventoryItem(item, count);
    }
  }
}
