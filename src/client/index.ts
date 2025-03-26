import {ClientInventory} from "./bridge/inventory/ClientInventory";
import {ClientFramework} from "./bridge/framework/ClientFramework";
import {TargetBase} from "./bridge/target/TargetBase";
import {NotifyBase} from "./bridge/notify/NotifyBase";
import {
  initializeClientFramework,
  initializeClientInventory, initializeMiniGame,
  initializeNotify, initializeProgressBar,
  initializeTarget
} from "./bridge/initialization";
import {MiniGame} from "./bridge/minigame/MiniGame";
import {ProgressBar} from "./bridge/progress/ProgressBar";
import {getPlayerData} from "./bridge/utils";
import {Shop} from "./shops/Shop";
import Config from "../common/config";
import {cache} from "@overextended/ox_lib/client";
import {Blip} from "./blips/Blip";
import {
  makeBuyShop,
  makeLeaderboardMenu,
  makeMainMenu,
  makeSellShop,
  makeStatsMenu
} from "./menus/initialization";
import {FrozenPedBlipMenu} from "./menus/FrozenPedBlipMenu";
import {frozenPedTargetZone} from "./bridge/zone/initialization";

exports('GetPlayerData', getPlayerData)

const clientInventory: ClientInventory = initializeClientInventory();
export const clientFramework: ClientFramework = initializeClientFramework(clientInventory).initializeEvents();
export const target: TargetBase = initializeTarget();
export const notify: NotifyBase = initializeNotify();
export const miniGame: MiniGame = initializeMiniGame();
export const progressBar: ProgressBar = initializeProgressBar();

export const shop: Shop = new Shop(`${cache.resource}`, Config.shop.buyShop.items, Config.shop.sellShop.items);
const staticMenus = [makeBuyShop(), makeSellShop()];
const dynamicMenus = [makeStatsMenu, makeLeaderboardMenu];
const blip: Blip = new Blip(Config.shop.blip)
const litterPickingMenu: FrozenPedBlipMenu = new FrozenPedBlipMenu(blip, frozenPedTargetZone, staticMenus, makeMainMenu, dynamicMenus);

shop.registerInputOnNets();
litterPickingMenu.initialize();
