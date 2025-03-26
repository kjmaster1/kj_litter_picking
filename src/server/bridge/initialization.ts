import {ServerInventory} from "./inventory/ServerInventory";
import {OxServerInventory} from "./inventory/OxServerInventory";
import {QbServerInventory} from "./inventory/QbServerInventory";
import {PsServerInventory} from "./inventory/PsServerInventory";
import {CoreServerInventory} from "./inventory/CoreServerInventory";
import {CodemInventory} from "./inventory/CodemInventory";
import {ServerFramework} from "./framework/ServerFramework";
import {EsxServerFramework} from "./framework/EsxServerFramework";
import {QboxServerFramework} from "./framework/QboxServerFramework";
import {QbCoreServerFramework} from "./framework/QbCoreServerFramework";
import {OxCoreServerFramework} from "./framework/OxCoreServerFramework";
import Config from "../../common/config";
import {cache, addCommand} from "@overextended/ox_lib/server";
import {serverFramework} from "../index";
import {ExperienceTable} from "./sql/ExperienceTable";
import {Shop} from "../shops/Shop";
import {Vector3} from "@nativewrappers/fivem";

export function initializeServerInventory(): ServerInventory {
  if (GetResourceState('ox_inventory') === 'started') {
    return new OxServerInventory('ox_inventory');
  } else if (GetResourceState("qb-inventory") === 'started') {
    return new QbServerInventory('qb-inventory');
  } else if (GetResourceState('qs-inventory') === 'started') {
    return new ServerInventory('qs-inventory');
  } else if (GetResourceState('ps-inventory') === 'started') {
    return new PsServerInventory('ps-inventory');
  } else if (GetResourceState('origen_inventory') === 'started') {
    return new ServerInventory('origen_inventory');
  } else if (GetResourceState('codem-inventory') === 'started') {
    return new CodemInventory('codem-inventory');
  } else if (GetResourceState('core_inventory') === 'started') {
    return new CoreServerInventory('core_inventory');
  }
  return undefined;
}

export function initializeServerFramework(serverInventory: ServerInventory): ServerFramework {
  if (GetResourceState('es_extended') === 'started') {
    return new EsxServerFramework(serverInventory);
  } else if (GetResourceState('qbx_core') === 'started') {
    return  new QboxServerFramework(serverInventory);
  } else if (GetResourceState('qb-core') === 'started') {
    return  new QbCoreServerFramework('qb', serverInventory);
  } else if (GetResourceState('ox_core') === 'started') {
    return  new OxCoreServerFramework(serverInventory);
  }
}

const testTablePromise = new ExperienceTable(cache.resource, 'testStat').createTableIfNotExists();

export function initializeTests(): void {

  if (Config.EnableServerTests) {

    testTablePromise.then(async (testTable) => {
      console.log('Table created:', testTable);

      const testShopCoords = new Vector3(150.71, -565.55, 43.89);
      const testShop = new Shop('testshop', 'cash', testShopCoords, Config.shop.buyShop.items, Config.shop.sellShop.items, testTable);
      await testShop.registerPurchaseOnNet();
      await testShop.registerSaleOnNet();

    }).catch((error) => {
      console.error('Error creating table:', error);
    });

    addCommand('testTableGetData', async (playerId, args) => {
      if (!playerId) return;
      const testTable = await testTablePromise;
      const type = typeof args[0] === 'string' ? args[0] : undefined
      const playerData = await testTable.getPlayerDataBySource(playerId, type);
      console.log('playerData', playerData);
    })

    addCommand('testTableAddData', async (playerId, args) => {
      if (!playerId) return;
      const testTable = await testTablePromise;
      if (typeof args[0] === 'string') {
        if (typeof Number(args[1]) === 'number') {
          await testTable.addPlayerDataBySource(playerId, args[0], Number(args[1]))
        }
      }
    })

    addCommand('testTableSaveData', async (playerId) => {
      if (!playerId) return;
      const testTable = await testTablePromise;
      await testTable.savePlayerDataBySource(playerId);
    })

    addCommand('testTableGetTop', async (playerId) => {
      if (!playerId) return;
      const testTable = await testTablePromise;
      const players = await testTable.getTopPlayers();
      console.log('players', players);
    })

    addCommand('getPlayer', async (playerId) => {
      if (!playerId) return;
      console.log(serverFramework.getPlayer(playerId));
    })
    addCommand('getIdentifier', async (playerId) => {
      if (!playerId) return;
      console.log(serverFramework.getIdentifier(playerId));
    })
    addCommand('getName', async (playerId) => {
      if (!playerId) return;
      console.log(serverFramework.getName(playerId));
    })
    addCommand('getItemCount', async (playerId, args) => {
      if (!args.length) return;
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        console.log(serverFramework.getItemCount(playerId, args[0]))
      }
    })
    addCommand('convertMoneyType', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[0] === 'bank' || args[0] == 'cash' || args[0] === 'money' || args[0] == 'crypto') {
          console.log(serverFramework.convertMoneyType(args[0]));
        }
      }
    })
    addCommand('checkPlayerBalance', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[0] === 'bank' || args[0] == 'cash' || args[0] === 'money' || args[0] === 'crypto') {
          console.log(serverFramework.getName(playerId), serverFramework.getPlayerBalance(playerId, args[0]));
        }
      }
    })
    addCommand('addMoney', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[0] === 'bank' || args[0] == 'cash' || args[0] === 'money' || args[0] === 'crypto') {
          if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
            serverFramework.addMoney(playerId, args[0], Number(args[1]))
          }
        }
      }
    })
    addCommand('removeMoney', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[0] === 'bank' || args[0] == 'cash' || args[0] === 'money' || args[0] === 'crypto') {
          if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
            serverFramework.removeMoney(playerId, args[0], Number(args[1]))
          }
        }
      }
    })
    addCommand('canCarry', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
          console.log(serverFramework.canCarry(playerId, args[0], Number(args[1])))
        }
      }
    })
    addCommand('bridgeAddItem', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
          serverFramework.addItem(playerId, args[0], Number(args[1]), {});
        }
      }
    })
    addCommand('bridgeRemoveItem', async (playerId, args) => {
      if (!playerId) return;
      if (args[0] !== undefined && typeof args[0] === 'string') {
        if (args[1] !== undefined && typeof Number(args[1]) === 'number') {
          serverFramework.removeItem(playerId, args[0], Number(args[1]))
        }
      }
    })
  }
}

export async function getPlayerData(source: number, type: string | undefined) {
  const table = await testTablePromise;
  return table.getPlayerDataBySource(source, type);
}

export async function getTopPlayers() {
  const table = await testTablePromise;
  return table.getTopPlayers();
}
