import {ServerInventory} from "./ServerInventory";
import {ServerFramework} from "../framework/ServerFramework";
import {QbCoreServerFramework, QbPlayer} from "../framework/QbCoreServerFramework";

export class PsServerInventory extends ServerInventory {

  canCarry(source: number, item: string, count: number, framework?: ServerFramework): boolean {
    if (framework instanceof QbCoreServerFramework) {
      const player = framework.getPlayer(source) as QbPlayer;
      if (!player) return false;
      const playerData = player.PlayerData;
      const totalWeight = exports[this.name].GetTotalWeight(playerData.items) as number;
      if (!totalWeight) return false;
      const items = framework.QB_CORE.Shared.Items
      const itemInfo = items[item.toLowerCase()] as Record<string, unknown>;
      if (!itemInfo) return false;
      return (totalWeight + (itemInfo['weight'] as number * count)) <= 120000;
    }
  }
}
