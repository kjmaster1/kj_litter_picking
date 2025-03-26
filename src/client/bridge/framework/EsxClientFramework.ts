import {ClientFramework} from "./ClientFramework";
import {cache} from "@overextended/ox_lib/client";


export class EsxClientFramework extends ClientFramework {

  ESX:any

  initializeEvents() : ClientFramework {
    super.initializeEvents();

    this.ESX = exports['es_extended'].getSharedObject();

    on(this.name + ':playerLoaded', (player: any) => {
      this.playerData = player;
      this.playerLoaded = true;
      TriggerEvent(`${cache.resource}:onPlayerLoaded`)
    })

    on(this.name + ':onPlayerLogout', () => {
      this.playerData = undefined;
      this.playerLoaded = false;
    })
    return this;
  }

  getPlayerData(): unknown {
    return this.ESX.GetPlayerData();
  }

  getPlayerInventory(): unknown {
    if (this.inventory) {
      return super.getPlayerInventory();
    } else {
      return (this.getPlayerData() as any).inventory;
    }
  }
}
