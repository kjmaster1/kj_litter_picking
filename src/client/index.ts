import {
  Blip,
  ClientFramework,
  ClientInventory,
  FrozenPedBlipMenu,
  getPlayerData,
  initializeClientFramework,
  initializeClientInventory,
  initializeNotify,
  initializeTarget,
  MiniGame,
  NotifyBase,
  ProgressBar,
  Shop,
  TargetBase,
} from "@kjmaster2/kj_lib/client";
import { cache } from "@overextended/ox_lib/client";
import Config from "../shared/config";
import {
  EntityRespawnTable,
  LitterEntityRespawnTable,
  LitterTargetZone,
} from "./litter/LitterTargetZone";
import {
  initializePickingProgressBar,
  makeBuyShop,
  makeLeaderboardMenu, makeLitterPickingZone,
  makeLitterTargetZones,
  makeMainMenu,
  makeSellShop,
  makeStatsMenu,
} from "./litter/initialization";

exports("GetPlayerData", getPlayerData);

const clientInventory: ClientInventory = initializeClientInventory();
export const clientFramework: ClientFramework =
  initializeClientFramework(clientInventory).initializeEvents();
export const target: TargetBase = initializeTarget(Config.setup.target);
export const notify: NotifyBase = initializeNotify(Config.setup.notify);
export const miniGame: MiniGame = new MiniGame();
export const pickingProgressBar: ProgressBar = initializePickingProgressBar();

export const shop: Shop = new Shop(
  clientFramework,
  `${cache.resource}`,
  Config.shop.buyShop.items,
  Config.shop.sellShop.items
);
const staticMenus = [makeBuyShop(), makeSellShop()];
const dynamicMenus = [makeStatsMenu, makeLeaderboardMenu];
const blip: Blip = new Blip(Config.shop.blip);
const  frozenPedTargetZone = makeLitterPickingZone()
const litterPickingMenu: FrozenPedBlipMenu = new FrozenPedBlipMenu(
  blip,
  frozenPedTargetZone,
  staticMenus,
  makeMainMenu,
  dynamicMenus
);
const litterTargetZones: LitterTargetZone[] = makeLitterTargetZones();

shop.registerInputOnNets();
litterPickingMenu.initialize();

litterTargetZones.forEach((zone) => {
  zone.createZone();
});

AddEventHandler("onResourceStop", (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) return;

  litterTargetZones.forEach((zone) => {
    for (let zoneId in zone.zoneEntityRespawnTable) {
      const litterEntityRespawnTable: LitterEntityRespawnTable =
        zone.zoneEntityRespawnTable[zoneId];
      for (let litterId in litterEntityRespawnTable) {
        const entityRespawnTable: EntityRespawnTable =
          litterEntityRespawnTable[litterId];
        if (
          entityRespawnTable.entity &&
          DoesEntityExist(entityRespawnTable.entity)
        ) {
          DeleteEntity(entityRespawnTable.entity);
        }
      }
      zone.zoneEntityRespawnTable[zoneId] = undefined;
    }
  });
});

setTick(async () => {
  for (const zone of litterTargetZones) {
    await zone.doRespawns();
  }
});
