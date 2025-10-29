import {
  ContextMenu,
  deepMerge,
  FrozenPedTargetZone,
  InteractTargetData,
  OxProgressBar,
  OxProgressBarTable,
  OxTargetOptions,
  ProgressBar,
  QbProgressBar,
  QbProgressBarTable,
  QbTargetParameters
} from "@kjmaster2/kj_lib/client";
import {cache, Point, triggerServerCallback} from "@overextended/ox_lib/client";
import Config from "../../shared/config";
import Locale from "../../shared/locale";
import {LitterTargetZone, LitterZoneTable} from "./LitterTargetZone";
import {LiterZoneDuration, LitterTable, LitterZone, LitterZoneReward, LitterZoneXp} from "./LitterZone";
import {Vector3, Vector4} from "@nativewrappers/fivem";
import {clientFramework, shop, target} from "../index";
import {PlayerData, TopPlayerData} from "@kjmaster2/kj_lib";

export function makeLitterPickingZone() {

  const point = new Point({
    coords: Config.setup.zoneLocation,
    distance: Config.setup.zoneDistance
  })

  const label = Locale('target.litter-picking-ped-target') as string;
  const name = 'litter-picking-ped-target';
  const icon = "fa-solid fa-exclamation-mark"

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
    target,
    point,
    targetData,
    undefined,
    Config.setup.pedModel,
    new Vector4(Config.setup.pedLocation[0], Config.setup.pedLocation[1], Config.setup.pedLocation[2], Config.setup.pedLocation[3]),
    Config.setup.pedScenario
  )
}

const litterPickingTarget = makeLitterPickingTarget();

export function makeLitterTargetZones(): LitterTargetZone[] {

  const litterTargetZones: LitterTargetZone[] = [];
  const zones = Config.picking.zones;
  zones.forEach((litterTargetZone: { center: any; distance: any; litterSpawns: any; }) => {

    const point = new Point({
      coords: litterTargetZone.center,
      distance: litterTargetZone.distance,
    })

    const litterZones = litterTargetZone.litterSpawns
    const litterZonesTable: LitterZoneTable = {}
    litterZones.forEach((zone: {
      litter: any;
      models: string[];
      level: number;
      duration: LiterZoneDuration;
      reward: LitterZoneReward[];
      xp: LitterZoneXp;
      respawn: number;
    }, index: string | number) => {
      const litterTable: LitterTable = {}
      const litters = zone.litter;
      litters.forEach((litter: number[], index: string | number) => {
        // @ts-ignore
        litterTable[index] = new Vector3(litter[0], litter[1], litter[2]);
      })
      // @ts-ignore
      litterZonesTable[index] = new LitterZone([], zone.models, zone.level, zone.duration, zone.reward, zone.xp, zone.respawn, litterTable);
    })
    litterTargetZones.push(new LitterTargetZone(point, litterPickingTarget, litterZonesTable))
  })
  return litterTargetZones;
}

function makeLitterPickingTarget(): InteractTargetData & OxTargetOptions & QbTargetParameters {
  const label = Locale('target.litter-picking-litter-target') as string;
  const name = 'litter-picking-litter-target';
  const icon = "fa-solid fa-exclamation-mark"

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

  return deepMerge(oxTargetData, qbTargetData, interactTargetData);
}

export function initializePickingProgressBar(): ProgressBar {

  const duration = 0;
  const name = Config.picking.animation.label;
  const useWhileDead = Config.picking.animation.useWhileDead;
  const canCancel = Config.picking.animation.canCancel;
  const disableCar = Config.picking.animation.disable.car;
  const disableMove = Config.picking.animation.disable.move;
  const disableCombat = Config.picking.animation.disable.combat;
  const dict = Config.picking.animation.anim.dict;
  const clip = Config.picking.animation.anim.clip;
  const bone = Config.picking.animation.prop.bone;
  const model = Config.picking.animation.prop.model;
  const coordsArr = Config.picking.animation.prop.pos;
  const coords = {x: coordsArr[0], y: coordsArr[1], z: coordsArr[2]};
  const rotationArr = Config.picking.animation.prop.rot;
  const rotation = {x: rotationArr[0], y: rotationArr[1], z: rotationArr[2]};

  const oxProgressBarData: OxProgressBarTable = {
    duration: duration,
    label: name,
    useWhileDead: useWhileDead,
    canCancel: canCancel,
    disable: {
      move: disableMove,
      car: disableCar,
      combat: disableCombat,
    },
    anim: {
      dict: dict,
      clip: clip,
    },
    prop: {
      model: model,
      bone: bone,
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
      disableMovement: disableMove,
      disableCarMovement: disableCar,
      disableCombat: disableCombat,
    },
    animation: {
      animDict: dict,
      anim: clip,
    },
    prop: {
      model: model,
      bone: bone,
      coords: coords,
      rotation: rotation,
    }
  }

  const progressBarData = deepMerge(oxProgressBarData, qbProgressBarData);

  return makeProgressBar(progressBarData);
}

export function makeProgressBar(progressBarTable: OxProgressBarTable & QbProgressBarTable): ProgressBar {
  if (Config.setup.progressBar === 'ox_lib') {
    return new OxProgressBar(progressBarTable);
  } else if (Config.setup.progressBar === 'qb') {
    return new QbProgressBar(progressBarTable);
  }
  return undefined;
}

const kj_litter_picking = exports[`${cache.resource}`];

export function makeBuyShop(): ContextMenu {
  const buyShop = [];
  const buyShopItems = Config.shop.buyShop.items as { [key: string]: any };
  console.log(buyShopItems);
  for (const itemKey in buyShopItems) {
    const buyShopItem = buyShopItems[itemKey];
    const itemData = clientFramework.getItemData(buyShopItem.item) as Record<string, unknown> || {label: 'Undefined'};

    buyShop.push({
      title: Locale('buy-menu.buy-shop-title', itemData.label, itemKey) as string || itemData.label as string,
      description: Locale('buy-menu.item-desc', itemData.label, (buyShopItem.price ?? 0).toLocaleString()) as string,
      icon: buyShopItem.icon,
      iconColor: buyShopItem.iconColor,
      image: `nui://${cache.resource}/install/images/` + buyShopItem.item + '.png' || null,
      event: `${cache.resource}:${shop.id}:purchase:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'kj-litter-picking-buy-shop',
    menu: 'litter-picking-shop-main',
    title: Locale('buy-menu.main-title') as string,
    options: buyShop
  })
}

export function makeSellShop(): ContextMenu {
  const sellShop = [];
  const sellShopItems = Config.shop.sellShop.items as { [key: string]: any };
  for (const itemKey in sellShopItems) {
    const sellShopItem = sellShopItems[itemKey];
    const itemData = clientFramework.getItemData(sellShopItem.item) as Record<string, unknown> || {label: 'Undefined'};

    sellShop.push({
      title: itemData.label as string,
      description: Locale('sell-menu.item-desc', itemData.label, (sellShopItem.price ?? 0).toLocaleString()) as string,
      icon: sellShopItem.icon,
      iconColor: sellShopItem.iconColor,
      event: `${cache.resource}:${shop.id}:sale:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'kj-litter-picking-sell-shop',
    menu: 'litter-picking-shop-main',
    title: Locale('sell-menu.main-title') as string,
    options: sellShop
  });
}

export async function makeMainMenu(): Promise<ContextMenu> {

  const playerDataArray = await (kj_litter_picking.GetPlayerData() as Promise<PlayerData>);
  const playerData : PlayerData = (playerDataArray?.[0] ?? {}) as PlayerData;
  console.log(playerData);
  const main = [];

  const experiencesTable = Config.experience as { [key: string]: number };
  let currentLvl = playerData['level']
  console.log('current level: ' + currentLvl)
  currentLvl = currentLvl as number;
  console.log('current level: ' + currentLvl)
  let exp = playerData['exp']
  console.log('current exp: ' + exp)
  exp = exp as number;
  console.log('current exp: ' + exp)
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
    if (nextLvlExp !== undefined) {
      nextLvlText = nextLvlExp.toLocaleString();
    }
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
      menu: "litter-picking-shop-stats"
    });
  }

  if (Config.leaderboard) {
    main.push({
      title: Locale("litter-picking-shop-menu.leaderboards-title") as string,
      description: Locale("litter-picking-shop-menu.leaderboards-desc") as string,
      icon: Config.icons.litter_picking_leaderboard,
      iconColor: Config.icons.litter_picking_leaderboard_color,
      menu: "litter-picking-shop-leaderboards"
    });
  }

  if (Config.shop.buyShop.enable) {
    main.push({
      title: Locale("litter-picking-shop-menu.shop-title") as string,
      description: Locale("litter-picking-shop-menu.shop-desc") as string,
      icon: Config.icons.litter_picking_buy_shop,
      iconColor: Config.icons.litter_picking_buy_shop_color,
      menu: "kj-litter-picking-buy-shop"
    })
  }

  if (Config.shop.sellShop.enable) {
    main.push({
      title: Locale("litter-picking-shop-menu.sell-title") as string,
      description: Locale("litter-picking-shop-menu.sell-desc") as string,
      icon: Config.icons.litter_picking_sell_shop,
      iconColor: Config.icons.litter_picking_sell_shop_color,
      menu: "kj-litter-picking-sell-shop"
    })
  }

  return new ContextMenu({
    id: "litter-picking-shop-main",
    title: Locale("litter-picking-shop-menu.main-title") as string,
    options: main
  })
}

export async function makeStatsMenu(): Promise<ContextMenu> {
  const stats = [];
  const playerDataArray: PlayerData = await kj_litter_picking.GetPlayerData();
  const playerData : PlayerData = (playerDataArray?.[0] ?? {}) as PlayerData;
  const pickedStat = playerData['picked'] as number ?? 0;
  const earned = playerData['earned'] as number ?? 0;
  const showStats = Object.values(Config.stats).some(Boolean);

  if (showStats && Config.stats.picked) {
    stats.push({
      title: Locale("stats-menu.picked-stat-title") as string,
      description: Locale("stats-menu.picked-stat-desc", pickedStat.toLocaleString()) as string,
      icon: Config.icons.stats_picked,
      iconColor: Config.icons.stats_picked_color,
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
      id: "litter-picking-shop-stats",
      menu: "litter-picking-shop-main",
      title: Locale("stats-menu.main-title") as string,
      options: stats
    })
  }
}

export async function makeLeaderboardMenu(): Promise<ContextMenu> {
  const leaderboard: { title: string; description: string; icon: string; iconColor: string; }[] = [];

  if (Config.leaderboard) {

    const topPlayers: TopPlayerData[] = await triggerServerCallback(`${cache.resource}:gettopplayers`, null) as TopPlayerData[];

    let rank = 0
    topPlayers.forEach((value) => {
      rank++
      leaderboard.push({
        title: value.name,
        description: Locale("leaderboard-menu.player-desc", value.level, (value.exp ?? 0).toLocaleString(), (value.stat ?? 0).toLocaleString()) as string,
        icon: rank < 3 ? Config.icons.leaderboard : undefined,
        iconColor: rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "brown" : "",
      });
    });

    return new ContextMenu({
      id: "litter-picking-shop-leaderboards",
      menu: "litter-picking-shop-main",
      title: Locale("leaderboard-menu.main-title") as string,
      options: leaderboard,
    })
  }
}
