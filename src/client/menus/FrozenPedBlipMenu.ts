import {cache} from "@overextended/ox_lib/client";
import {Blip} from "../blips/Blip";
import {FrozenPedTargetZone} from "../bridge/zone/FrozenPedTargetZone";
import {ContextMenu} from "./ContextMenu";

export class FrozenPedBlipMenu {

  constructor(readonly blip: Blip, readonly zone: FrozenPedTargetZone, readonly staticMenus: ContextMenu[], private mainMenuBuilder: () => Promise<ContextMenu>, private dynamicMenuBuilders: (() => Promise<ContextMenu>)[]) {
  }

  initialize() {
    onNet(`${cache.resource}:onPlayerLoaded`, () => {
      this.blip.displayBlip(this.zone.pedLocation)
      this.registerStaticMenus();
      this.zone.createZone();
      this.zone.setTargetDataOnSelect(this.openMenu);
    });
  }

  openMenu = async () => {
    for (const menuBuilder of this.dynamicMenuBuilders) {
      const menu = await menuBuilder();
      menu.registerContext();
    }
    const mainMenu = await this.mainMenuBuilder();
    mainMenu.registerContext();
    mainMenu.showContext();
  }

  registerStaticMenus() {
    for (const menu of this.staticMenus) {
     menu.registerContext();
    }
  }
}
