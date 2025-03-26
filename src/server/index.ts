import { cache } from '@overextended/ox_lib/server';
import {ServerFramework} from "./bridge/framework/ServerFramework";
import {ServerInventory} from "./bridge/inventory/ServerInventory";
import {
  initializeServerFramework,
  initializeServerInventory,
} from "./bridge/initialization";
import lib from "@overextended/ox_lib/server";
import {ExperienceTable} from "./bridge/sql/ExperienceTable";
import {Vector3} from "@nativewrappers/fivem";
import {Shop} from "./shops/Shop";
import Config from "../common/config";

const serverInventory: ServerInventory = initializeServerInventory();
export const serverFramework: ServerFramework = initializeServerFramework(serverInventory);

lib.onClientCallback(`${cache.resource}:getplayerdata`, (source: number, type: string) => {
  return getPlayerData(source, type);
});

lib.onClientCallback(`${cache.resource}:gettopplayers`, () => {
  return getTopPlayers();
});

const litterPickingTable = new ExperienceTable(cache.resource, 'picked').createTableIfNotExists();

litterPickingTable.then(async (table) => {
  const litterPickingShopCoords = new Vector3(Config.setup.pedLocation[0], Config.setup.pedLocation[1], Config.setup.pedLocation[2]);
  const litterPickingShop = new Shop(`${cache.resource}`, Config.shop.account, litterPickingShopCoords, Config.shop.buyShop.items, Config.shop.sellShop.items, table);
  await litterPickingShop.registerPurchaseOnNet();
  await litterPickingShop.registerSaleOnNet();
})

export async function getPlayerData(source: number, type: string | undefined) {
  const table = await litterPickingTable
  return table.getPlayerDataBySource(source, type);
}

export async function getTopPlayers() {
  const table = await litterPickingTable;
  return table.getTopPlayers();
}

exports('GetPlayerData', getPlayerData);
