import {ClientFramework} from "./ClientFramework";
import {cache} from "@overextended/ox_lib/client";


export class OxCoreClientFramework extends ClientFramework {

  OX:any

  initializeEvents(): ClientFramework {
    super.initializeEvents();

    this.OX = exports['ox_core'];

    AddEventHandler('ox:playerLoaded', () => {
      this.playerData = this.getPlayerData()
      this.playerLoaded = true
      TriggerEvent(`${cache.resource}:onPlayerLoaded`)
    })

    AddEventHandler('ox:playerLogout', () => {
      this.playerData = undefined
      this.playerLoaded = false
    })
    return this;
  }

  getPlayerData(): unknown {
    return this.OX.GetPlayer();
  }

  getPlayerInventory(): unknown {
    if (this.inventory) {
      return super.getPlayerInventory()
    } else {
      console.error('ox framework detected but you\'re not using ox_inventory!')
    }
  }
}
