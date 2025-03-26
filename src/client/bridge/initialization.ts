import {ClientInventory} from "./inventory/ClientInventory";
import {OxClientInventory} from "./inventory/OxClientInventory";
import {QbClientInventory} from "./inventory/QbClientInventory";
import {QsClientInventory} from "./inventory/QsClientInventory";
import {PsClientInventory} from "./inventory/PsClientInventory";
import {OrigenClientInventory} from "./inventory/OrigenClientInventory";
import {CodemClientInventory} from "./inventory/CodemClientInventory";
import {CoreClientInventory} from "./inventory/CoreClientInventory";
import {ClientFramework} from "./framework/ClientFramework";
import {EsxClientFramework} from "./framework/EsxClientFramework";
import {QbCoreClientFramework} from "./framework/QbCoreClientFramework";
import {OxCoreClientFramework} from "./framework/OxCoreClientFramework";
import {QboxClientFramework} from "./framework/QboxClientFramework";
import {TargetBase} from "./target/TargetBase";
import Config from "../../common/config";
import {OxTarget, OxTargetOptions} from "./target/OxTarget";
import {QbTarget, QbTargetParameters} from "./target/QbTarget";
import {InteractTargetData, InteractTarget} from "./target/InteractTarget";
import {NotifyBase} from "./notify/NotifyBase";
import {OxLibNotify} from "./notify/OxLibNotify";
import {EsxNotify} from "./notify/EsxNotify";
import {QbNotify} from "./notify/QbNotify";
import {SdNotify} from "./notify/SdNotify";
import {WasabiNotify} from "./notify/WasabiNotify";
import {addCommand} from "@overextended/ox_lib/server";
import {clientFramework, miniGame, notify, progressBar} from "../index";
import {MiniGame} from "./minigame/MiniGame";
import {ProgressBar} from "./progress/ProgressBar";
import {cache, Point, triggerServerCallback} from "@overextended/ox_lib/client";
import {Vector4} from "@nativewrappers/fivem";
import Locale from "../../common/locale";
import {makeProgressBar} from "./progress/utils";
import {FrozenPedTargetZone} from "./zone/FrozenPedTargetZone";
import {deepMerge} from "./utils";
import {OxProgressBarTable} from "./progress/OxProgressBar";
import {QbProgressBarTable} from "./progress/QbProgressBar";
import {Blip} from "../blips/Blip";
import {ContextMenu} from "../menus/ContextMenu";
import {FrozenPedBlipMenu} from "../menus/FrozenPedBlipMenu";
import {Shop} from "../shops/Shop";
import {PlayerData, TopPlayerData} from "../../common/interface";

const kj_fivem_template = exports['kj_fivem_template'];
const frozenPedTargetZone: FrozenPedTargetZone = makeTestZone();
const shop: Shop = new Shop('testshop', Config.shop.buyShop.items, Config.shop.sellShop.items);

export function initializeClientInventory(): ClientInventory {
  if (GetResourceState('ox_inventory') === 'started') {
    return new OxClientInventory('ox_inventory');
  } else if (GetResourceState("qb-inventory") === 'started') {
    return new QbClientInventory('qb-inventory');
  } else if (GetResourceState('qs-inventory') === 'started') {
    return new QsClientInventory('qs-inventory');
  } else if (GetResourceState('ps-inventory') === 'started') {
    return new PsClientInventory('ps-inventory');
  } else if (GetResourceState('origen_inventory') === 'started') {
    return new OrigenClientInventory('origen_inventory');
  } else if (GetResourceState('codem-inventory') === 'started') {
    return new CodemClientInventory('codem-inventory');
  } else if (GetResourceState('core_inventory') === 'started') {
    return new CoreClientInventory('core_inventory');
  }
  console.log("No inventory found, returning undefined...")
  return undefined;
}

export function initializeClientFramework(clientInventory: ClientInventory): ClientFramework {
  if (GetResourceState('es_extended') === 'started') {
    return new EsxClientFramework('esx', clientInventory);
  } else if (GetResourceState('qb-core') === 'started') {
    return new QbCoreClientFramework('qb', clientInventory);
  } else if (GetResourceState('ox_core') === 'started') {
    return new OxCoreClientFramework('ox', clientInventory);
  } else if (GetResourceState('qbx_core') === 'started') {
    return new QboxClientFramework(clientInventory);
  }
  console.error('No framework detected! Things will be very broken!')
  return undefined;
}

export function initializeTarget(): TargetBase {
  if (Config.setup.target === 'ox_target') {
    return new OxTarget('ox_target');
  } else if (Config.setup.target === 'qb-target') {
    return new QbTarget('qb-target');
  } else if (Config.setup.target === 'interact') {
    return new InteractTarget('interact');
  }
  console.log("No valid targeting resource specified in config, returning undefined...")
  return undefined;
}

export function initializeNotify(): NotifyBase {
  let notify: NotifyBase = undefined;
  if (Config.setup.notify === 'ox_lib') {
    notify = new OxLibNotify('ox_lib');
  } else if (Config.setup.notify === 'esx') {
    notify = new EsxNotify('esx');
  } else if (Config.setup.notify === 'qb') {
    notify = new QbNotify('qb');
  } else if (Config.setup.notify === 'sd-notify') {
    notify = new SdNotify('sd-notify');
  } else if (Config.setup.notify === 'wasabi-notify') {
    notify = new WasabiNotify('wasabi-notify');
  }
  if (!notify) console.log("No valid notification resource specified in config, returning undefined...")
  else {
    onNet(`${cache.resource}:notify`, (message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) => {
      notify.showNotification(message, type, title, position, duration, playSound, icon);
    })
  }
  return notify;
}

export function initializeMiniGame(): MiniGame {
  if (Config.setup.miniGame === 'ox_lib') {
    return new MiniGame();
  }
}

export function initializeProgressBar(): ProgressBar {

  const duration = 2000;
  const name = 'Drinking Water';
  const useWhileDead = false;
  const canCancel = false;
  const disableCar = true;
  const dict = 'mp_player_intdrink';
  const clip = 'loop_bottle';
  const model = 'prop_ld_flow_bottle';
  const coords = {x: 0.03, y: 0.03, z: 0.02};
  const rotation = {x: 0.0, y: 0.0, z: -1.5};

  const oxProgressBarData: OxProgressBarTable = {
    duration: duration,
    label: name,
    useWhileDead: useWhileDead,
    canCancel: canCancel,
    disable: {
      car: disableCar,
    },
    anim: {
      dict: dict,
      clip: clip
    },
    prop: {
      model: model,
      pos: coords,
      rot: rotation,
    }
  }

  const qbProgressBarData: QbProgressBarTable = {
    name: name,
    duration: duration,
    label: name,
    useWhileDead: useWhileDead,
    canCancel: canCancel,
    controlDisables: {
      disableCarMovement: disableCar,
    },
    animation: {
      animDict: dict,
      anim: dict
    },
    prop: {
      model: model,
      coords: coords,
      rotation: rotation,
    }
  }

  const progressBarData = deepMerge(oxProgressBarData, qbProgressBarData);

  return makeProgressBar(progressBarData);
}

function makeTestZone() {

  const point = new Point({
    coords: Config.setup.zoneLocation,
    distance: Config.setup.zoneDistance
  })

  const label = Locale('target.test-ped-target') as string;
  const name = 'test-ped-target';
  const icon = "fa-solid fa-question"

  const oxTargetData: OxTargetOptions = {
    label: label,
    name: name,
    icon: icon,
  }

  const qbTargetData: QbTargetParameters = {
    options: {
      label: label
    },
    distance: 2
  }

  const interactTargetData: InteractTargetData = {
    name: name,
    id: name,
    options: {
      label: label,
    }
  }

  const targetData = deepMerge(oxTargetData, qbTargetData, interactTargetData);

  return new FrozenPedTargetZone(
    point,
    targetData,
    undefined,
    Config.setup.pedModel,
    new Vector4(Config.setup.pedLocation[0], Config.setup.pedLocation[1], Config.setup.pedLocation[2], Config.setup.pedLocation[3]),
    Config.setup.pedScenario
  )
}

export async function initializeTests(): Promise<void> {
  if (Config.EnableClientTests) {

    const blip: Blip = new Blip(Config.shop.blip)

    shop.registerInputOnNets();

    const staticMenus = [makeBuyShop(), makeSellShop()];
    const dynamicMenus = [makeStatsMenu, makeLeaderboardMenu];
    const testMenu: FrozenPedBlipMenu = new FrozenPedBlipMenu(blip, frozenPedTargetZone, staticMenus, makeMainMenu, dynamicMenus);

    testMenu.initialize();

    addCommand('doMiniGameTest', async () => {
      if (await miniGame.doMiniGame({difficulty: 'medium', inputs: 'test'})) {
        console.log('Do stuff when succeed');
      } else console.log('Do stuff when failed');
    })

    addCommand('doNotifyTest', async () => {
      notify.showNotification('Test Notification', 'success', 'Test Notification', 'top', 5000, false, "fa-solid fa-question");
    })

    addCommand('doProgressBarTest', async () => {
      if (await progressBar.doProgressBar()) console.log('Do stuff when complete');
      else console.log('Do stuff when cancelled')
    })

    addCommand('getPlayerData', async () => {
      console.log(clientFramework.getPlayerData());
    })
    addCommand('getPlayerInventory', async () => {
      console.log(clientFramework.getPlayerInventory());
    })
    addCommand('getItemData', async (playerId, args) => {
      if (args[0] !== undefined && typeof args[0] === 'string') {
        console.log(clientFramework.getItemData(args[0]));
      }
    })
    addCommand('hasItem', async (playerId, args) => {
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
          console.log(clientFramework.hasItem(args[0], Number(args[1])));
        }
      }
    })
  }
}

function makeBuyShop(): ContextMenu {
  const buyShop = [];
  const buyShopItems = Config.shop.buyShop.items as { [key: string]: any };
  for (const itemKey in buyShopItems) {
    const buyShopItem = buyShopItems[itemKey];
    const itemData = clientFramework.getItemData(buyShopItem.item) as Record<string, unknown> || {label: 'Undefined'};

    buyShop.push({
      title: Locale('buy-menu.buy-shop-title', itemData.label, itemKey) as string || itemData.label as string,
      description: Locale('buy-menu.item-desc', itemData.label, (buyShopItem.price).toLocaleString()) as string,
      icon: buyShopItem.icon,
      iconColor: buyShopItem.iconColor,
      image: `nui://${cache.resource}/install/images/` + buyShopItem.item + '.png' || null,
      event: `${cache.resource}:${shop.id}:purchase:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'test-shop-buy-shop',
    menu: 'test-shop-main',
    title: Locale('buy-menu.main-title') as string,
    options: buyShop
  })
}

function makeSellShop(): ContextMenu {
  const sellShop = [];
  const sellShopItems = Config.shop.sellShop.items as { [key: string]: any };
  for (const itemKey in sellShopItems) {
    const sellShopItem = sellShopItems[itemKey];
    const itemData = clientFramework.getItemData(sellShopItem.item) as Record<string, unknown> || {label: 'Undefined'};

    sellShop.push({
      title: itemData.label as string,
      description: Locale('sell-menu.item-desc', itemData.label, (sellShopItem.price).toLocaleString()) as string,
      icon: sellShopItem.icon,
      iconColor: sellShopItem.iconColor,
      event: `${cache.resource}:${shop.id}:sale:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'test-shop-sell-shop',
    menu: 'test-shop-main',
    title: Locale('sell-menu.main-title') as string,
    options: sellShop
  });
}

async function makeMainMenu(): Promise<ContextMenu> {

  const playerData = await (kj_fivem_template.GetPlayerData() as Promise<PlayerData>);
  const main = [];

  const experiencesTable = Config.experience as { [key: string]: number };
  const currentLvl = playerData['level'] as number

  const exp = playerData['exp'] as number
  const currentLvlExp = experiencesTable[currentLvl.toString()];
  const nextLvl = currentLvl + 1;
  const nextLvlExp = experiencesTable[nextLvl.toString()];
  const lvlProgress = exp - currentLvlExp;
  const lvlExpNeeded = nextLvlExp - currentLvlExp;
  let progress = 100;
  let nextLvlText = Locale("player-data.meta-maxed-level");
  let remainderText = Locale('player-data.meta-maxed-level');
  const length = Object.keys(experiencesTable).length;

  if (currentLvl < length) {
    progress = Math.floor((lvlProgress / lvlExpNeeded) * 100);
    nextLvlText = nextLvlExp.toLocaleString()
    remainderText = (lvlExpNeeded - lvlProgress).toLocaleString()
  }

  main.push({
    title: Locale("player-data.level-title", currentLvl, length) as string,
    description: Locale("player-data.level-desc", exp.toLocaleString()) as string,
    icon: Config.icons.player_level,
    iconColor: Config.icons.player_level_color,
    progress,
    colorScheme: progress <= 25 ? "red" : progress <= 75 ? "yellow" : "green",
    metadata: [
      {label: Locale("player-data.meta-next-level"), value: nextLvlText},
      {label: Locale("player-data.meta-remainder"), value: remainderText}
    ]
  });

  const showStats = Object.values(Config.stats).some(Boolean);

  if (showStats) {
    main.push({
      title: Locale("player-data.stats-title") as string,
      description: Locale("player-data.stats-desc") as string,
      icon: Config.icons.view_stats,
      iconColor: Config.icons.view_stats_color,
      menu: "test-shop-stats"
    });
  }

  if (Config.leaderboard) {
    main.push({
      title: Locale("test-shop-menu.leaderboards-title") as string,
      description: Locale("test-shop-menu.leaderboards-desc") as string,
      icon: Config.icons.test_shop_leaderboard,
      iconColor: Config.icons.test_shop_leaderboard_color,
      menu: "test-shop-leaderboards"
    });
  }

  if (Config.shop.buyShop.enable) {
    main.push({
      title: Locale("test-shop-menu.shop-title") as string,
      description: Locale("test-shop-menu.shop-desc") as string,
      icon: Config.icons.test_buy_shop,
      iconColor: Config.icons.test_buy_shop_color,
      menu: "test-shop-buy-shop"
    })
  }

  if (Config.shop.sellShop.enable) {
    main.push({
      title: Locale("test-shop-menu.sell-title") as string,
      description: Locale("test-shop-menu.sell-desc") as string,
      icon: Config.icons.test_sell_shop,
      iconColor: Config.icons.test_sell_shop_color,
      menu: "test-shop-sell-shop"
    })
  }

  return new ContextMenu({
    id: "test-shop-main",
    title: Locale("test-shop-menu.main-title") as string,
    options: main
  })
}

async function makeStatsMenu(): Promise<ContextMenu> {
  const stats = [];
  const playerData: PlayerData = await kj_fivem_template.GetPlayerData();
  const testStat = playerData['testStat'] as number;
  const earned = playerData['earned'] as number;
  const showStats = Object.values(Config.stats).some(Boolean);

  if (showStats && Config.stats.testStat) {
    stats.push({
      title: Locale("stats-menu.test-stat-title") as string,
      description: Locale("stats-menu.test-stat-desc", testStat.toLocaleString()) as string,
      icon: Config.icons.stats_test_stat,
      iconColor: Config.icons.stats_test_stat_color,
    });
  }
  if (showStats && Config.stats.earned) {
    stats.push({
      title: Locale("stats-menu.earned-title") as string,
      description: Locale("stats-menu.earned-desc", earned.toLocaleString()) as string,
      icon: Config.icons.stats_earned,
      iconColor: Config.icons.stats_earned_color,
    });
  }

  if (showStats) {
    return new ContextMenu({
      id: "test-shop-stats",
      menu: "test-shop-main",
      title: Locale("stats-menu.main-title") as string,
      options: stats
    })
  }
}

async function makeLeaderboardMenu(): Promise<ContextMenu> {
  const leaderboard: { title: string; description: string; icon: string; iconColor: string; }[] = [];

  if (Config.leaderboard) {

    const topPlayers: TopPlayerData[] = await triggerServerCallback(`${cache.resource}:gettopplayers`, null) as TopPlayerData[];

    let rank = 0
    topPlayers.forEach((value) => {
      rank++
      leaderboard.push({
        title: value.name,
        description: Locale("leaderboard-menu.player-desc", value.level, (value.exp).toLocaleString(), (value.stat).toLocaleString()) as string,
        icon: rank < 3 ? Config.icons.leaderboard : undefined,
        iconColor: rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "brown" : "",
      });
    });

    return new ContextMenu({
      id: "test-shop-leaderboards",
      menu: "test-shop-main",
      title: Locale("leaderboard-menu.main-title") as string,
      options: leaderboard,
    })
  }
}
