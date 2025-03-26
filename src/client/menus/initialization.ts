import {ContextMenu} from "./ContextMenu";
import Config from "../../common/config";
import {clientFramework, shop} from "../index";
import Locale from "../../common/locale";
import {cache, triggerServerCallback} from "@overextended/ox_lib/client";
import {PlayerData, TopPlayerData} from "../../common/interface";

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
      description: Locale('buy-menu.item-desc', itemData.label, (buyShopItem.price).toLocaleString()) as string,
      icon: buyShopItem.icon,
      iconColor: buyShopItem.iconColor,
      image: `nui://${cache.resource}/install/images/` + buyShopItem.item + '.png' || null,
      event: `${cache.resource}:${shop.id}:purchase:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'kj-litter-picking-buy-shop',
    menu: 'kj-litter-picking-shop-main',
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
      description: Locale('sell-menu.item-desc', itemData.label, (sellShopItem.price).toLocaleString()) as string,
      icon: sellShopItem.icon,
      iconColor: sellShopItem.iconColor,
      event: `${cache.resource}:${shop.id}:sale:selectquantity`,
      args: itemKey
    })
  }

  return new ContextMenu({
    id: 'kj-litter-picking-sell-shop',
    menu: 'kj-litter-picking-shop-main',
    title: Locale('sell-menu.main-title') as string,
    options: sellShop
  });
}

export async function makeMainMenu(): Promise<ContextMenu> {

  const playerData = await (kj_litter_picking.GetPlayerData() as Promise<PlayerData>);
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
  const playerData: PlayerData = await kj_litter_picking.GetPlayerData();
  const pickedStat = playerData['picked'] as number;
  const earned = playerData['earned'] as number;
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
        description: Locale("leaderboard-menu.player-desc", value.level, (value.exp).toLocaleString(), (value.stat).toLocaleString()) as string,
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
