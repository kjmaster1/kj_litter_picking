import lib, {cache} from '@overextended/ox_lib/server';
import {Vector3} from "@nativewrappers/fivem";
import Config from "../shared/config";
import {
  ExperienceTable,
  initializeServerFramework,
  initializeServerInventory,
  ServerFramework,
  ServerInventory,
  Shop
} from "@kjmaster2/kj_lib/server";

const serverInventory: ServerInventory = initializeServerInventory();
export const serverFramework: ServerFramework = initializeServerFramework(serverInventory);

lib.onClientCallback(`${cache.resource}:getplayerdata`, (source: number, type: string) => {
  return getPlayerData(source, type);
});

lib.onClientCallback(`${cache.resource}:gettopplayers`, () => {
  return getTopPlayers();
});

lib.onClientCallback(`${cache.resource}:getMetadata`, (playerId, item: string) => {
  return serverFramework.getMetadata(playerId, item);
})

const litterPickingTable = new ExperienceTable(serverFramework, cache.resource, 'picked').createTableIfNotExists();

litterPickingTable.then(async (table) => {
  const litterPickingShopCoords = new Vector3(Config.setup.pedLocation[0], Config.setup.pedLocation[1], Config.setup.pedLocation[2]);
  const litterPickingShop = new Shop(serverFramework, `${cache.resource}`, Config.shop.account, litterPickingShopCoords, Config.shop.buyShop.items, Config.shop.sellShop.items, table);
  await litterPickingShop.registerPurchaseOnNet();
  await litterPickingShop.registerSaleOnNet();
})

export async function getPlayerData(source: number, type: string | undefined) {
  const table = await litterPickingTable
  const playerData = table.getPlayerDataBySource(serverFramework, source, type);
  return playerData;
}

export async function getTopPlayers() {
  const table = await litterPickingTable;
  return table.getTopPlayers();
}

exports('GetPlayerData', getPlayerData);
