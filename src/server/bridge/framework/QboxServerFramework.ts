import {QbCoreServerFramework, QbPlayer} from "./QbCoreServerFramework";
import {ServerInventory} from "../inventory/ServerInventory";


interface QboxPlayer extends QbPlayer {}

export class QboxServerFramework extends QbCoreServerFramework {

  constructor(readonly inventory: ServerInventory) {
    super('qbx', inventory);
  }

  getPlayer(source: number): unknown {
    return exports.qbx_core.GetPlayer(source) as QboxPlayer
  }
}
