import {QbCoreClientFramework} from "./QbCoreClientFramework";
import {ClientFramework} from "./ClientFramework";
import {ClientInventory} from "../inventory/ClientInventory";
import {cache} from "@overextended/ox_lib/client";


export class QboxClientFramework extends QbCoreClientFramework {

  constructor(readonly inventory: ClientInventory) {
    super('qbx', inventory);
  }

  initializeEvents(): ClientFramework {
    super.initializeEvents();
    this.QBCORE = exports['qb-core'].GetCoreObject();

    AddEventHandler('QBCore:Client:OnPlayerLoaded', () => {
      this.playerData = this.getPlayerData();
      this.playerLoaded = true;
      TriggerEvent(`${cache.resource}:onPlayerLoaded`);
    })

    on('qbx_core:client:playerLoggedOut', () => {
      this.playerData = undefined
      this.playerLoaded = false
    })
    return this;
  }

  getPlayerData(): unknown {
    return exports.qbx_core.GetPlayerData();
  }
}
