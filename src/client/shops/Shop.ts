import {cache, inputDialog} from "@overextended/ox_lib/client";
import Locale from "../../common/locale";
import {clientFramework} from "../index";
import {ShopItems} from "../../common/interface";


export class Shop {

  constructor(readonly id: string, readonly purchaseItems?: ShopItems,
              readonly saleItems?: ShopItems) {
  }

  registerInputOnNets() {
    this.registerOnNet(`${cache.resource}:${this.id}:purchase:selectquantity`, `${cache.resource}:${this.id}:completepurchase`, this.purchaseItems)
    this.registerOnNet(`${cache.resource}:${this.id}:sale:selectquantity`, `${cache.resource}:${this.id}:completesale`, this.saleItems)
  }

  registerOnNet(onNetId:string, emitNetId: string, items: ShopItems) {
    onNet(onNetId, (id: number) => {
      if (!id) return;
      const shopItem = items[id]
      if (!shopItem) return;
      const itemData = (clientFramework.getItemData(shopItem.item) || {label: 'Undefined'}) as Record<string, string>
      const input = inputDialog(<string>itemData.label, [
        {
          type: 'number',
          icon: "fas fa-hashtag",
          label: Locale("inputs.label") as string,
          description: Locale("inputs.desc") as string,
          default: 1,
          required: true
        }
      ], {})
      setTimeout(async () => {
        await input.then(
          value => {
            emitNet(emitNetId, id, value[0]);
          }
        )
      }, 100)
    })
  }
}
