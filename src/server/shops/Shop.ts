import {cache} from "@overextended/ox_lib/client";
import Locale from "../../common/locale";
import {Vector3} from "@nativewrappers/fivem";
import {serverFramework} from "../index";
import {ExperienceTable} from "../bridge/sql/ExperienceTable";
import {ShopItems} from "../../common/interface";

export class Shop {

  constructor(readonly id: string, readonly accountType: string, readonly shopCoords: Vector3, readonly purchaseItems?: ShopItems,
              readonly saleItems?: ShopItems, readonly experienceTable?: ExperienceTable) {
  }

  async registerPurchaseOnNet() {
    onNet(`${cache.resource}:${this.id}:completepurchase`, async (itemId: number, input: number) => {
      await this.completePurchase(itemId, input);
    });
  }

  async registerSaleOnNet() {
    onNet(`${cache.resource}:${this.id}:completesale`, async (itemId: number, input: number) => {
      await this.completeSale(itemId, input);
    });
  }

  async completePurchase(itemId: number, input: number) {
    if (!this.purchaseItems) return;
    const netId = source
    if (!netId || !itemId || !input || input <= 0) {
      if (input <= 0) {
        emitNet(`${cache.resource}:notify`, netId, Locale('notify.no-negative'), 'error', undefined, 'top')
        return;
      }
      return;
    }

    const item = this.purchaseItems[itemId.toString()]
    if (!item) return

    if (item.level && this.experienceTable) {
      const level = await this.experienceTable.getPlayerDataBySource(netId, 'level') as number;
      if (level < item.level) {
        emitNet(`${cache.resource}:notify`, netId, Locale('notify.not-experienced'), 'error', undefined, 'top')
        return
      }
    }

    const total: number = Math.floor(item.price * input)
    if (!total || total < 1) return
    const balance: number = serverFramework.getPlayerBalance(netId, this.accountType)
    if (!balance || balance < total) {
      emitNet(`${cache.resource}:notify`, netId, Locale('notify.no-money'), 'error', undefined, 'top')
      return
    }
    if (!serverFramework.canCarry(netId, item.item, input)) {
      emitNet(`${cache.resource}:notify`, netId, Locale('notify.cant-carry'), 'error', undefined, 'top')
      return
    }

    if (!this.distanceCheck(netId)) return;

    serverFramework.removeMoney(netId, this.accountType, total)
    serverFramework.addItem(netId, item.item, input, item.metadata)

    // if (serverConfig.logs.events.purchased) {
    //   playerLog(netID, Locale('logs.purchased-title'), Locale('logs.purchased-message', name, identifier, input, item.item))
    // }
  }

  async completeSale(itemId: number, input: number) {
    if (!this.saleItems) return;
    const netId = source
    if (!netId || !itemId || !input || input <= 0) {
      if (input <= 0) {
        emitNet(`${cache.resource}:notify`, netId, Locale('notify.no-negative'), 'error', undefined, 'top')
        return;
      }
      return;
    }

    const item = (this.saleItems)[itemId.toString()]
    if (!item) return

    const total: number = Math.floor(item.price * input)
    if (!total || total < 1) return

    const hasItem = serverFramework.getItemCount(netId, item.item) >= input
    if (!hasItem) {
      emitNet(`${cache.resource}:notify`, netId, Locale('notify.no-item'), 'error', undefined, 'top')
      return;
    }

    if (!this.distanceCheck(netId)) return;

    serverFramework.removeItem(netId, item.item, input)
    serverFramework.addMoney(netId, this.accountType, total)

    if (this.experienceTable) {
      await this.experienceTable.addPlayerDataBySource(netId, 'earned', total);
    }

    // if (serverConfig.logs.events.pawned) {
    //   playerLog(netID, Locale('logs.pawned-title'), Locale('logs.pawned-message', name, identifier, input, item.item))
    // }
  }

  distanceCheck(netId: number) {
    const identifier: string = serverFramework.getIdentifier(netId).toString()
    if (!identifier) return;
    const name: string = serverFramework.getName(netId)
    if (!name) return;
    const playerCoordsArray: number[] = GetEntityCoords(GetPlayerPed(netId))
    const playerCoords: Vector3 = new Vector3(playerCoordsArray[0], playerCoordsArray[1], playerCoordsArray[2]);
    const distance = this.shopCoords.distance(playerCoords)
    return distance <= 15;
  }
}
