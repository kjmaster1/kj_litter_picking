import {ServerFramework} from "./ServerFramework";
import {ServerInventory} from "../inventory/ServerInventory";

interface OxCore {
  getPlayer(source: number): OxPlayer;
  GetCharacterAccount(source: number): OxCharacterAccount;
  DepositMoney(source: number, id: number, amount: number): void;
  WithdrawMoney(source: number, id: number, amount: number): void;
}

interface OxPlayer {
  stateId: number | string;
  get(field: string): string
}

interface OxCharacterAccount {
  balance: number;
  id: number;
}

export class OxCoreServerFramework extends ServerFramework {

  private OX: OxCore;

  constructor(readonly inventory: ServerInventory) {
    super('ox', inventory);
    this.OX = exports['ox_core'] as unknown as OxCore;
  }

  getPlayer(source: number): unknown {
    return this.OX.getPlayer(source);
  }

  getIdentifier(source: number): string | number {
    const player = this.getPlayer(source) as OxPlayer;
    if (!player) return undefined;
    return player.stateId;
  }

  getName(source: number): string {
    const player = this.getPlayer(source) as OxPlayer;
    if (!player) return undefined;
    return player.get('firstName') + ' ' + player.get('lastName')
  }

  convertMoneyType(type: string): string {
    if (type === 'cash') return 'money';
    return super.convertMoneyType(type);
  }

  getPlayerBalance(source: number, type: string): number {
    if (!source || !this.getPlayer(source)) return 0;
    if (type === 'cash' || type === 'money') {
      return this.getItemCount(source, this.convertMoneyType(type));
    }
    return this.OX.GetCharacterAccount(source).balance;
  }

  addMoney(source: number, type: string, amount: number) {
    if (type === 'cash' || type === 'money') {
      exports.ox_inventory.AddItem(source, this.convertMoneyType(type), amount);
    } else {
      const id = this.OX.GetCharacterAccount(source).id;
      this.OX.DepositMoney(source, id, amount);
    }
  }

  removeMoney(source: number, type: string, amount: number) {
    if (type === 'cash' || type === 'money') {
      this.removeItem(source, this.convertMoneyType(type), amount);
    } else {
      const id = this.OX.GetCharacterAccount(source).id;
      this.OX.WithdrawMoney(source, id, amount);
    }
  }
}
