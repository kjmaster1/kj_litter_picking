import {ClientInventory} from "./ClientInventory";
import {ClientFramework} from "../framework/ClientFramework";
import {QbCoreClientFramework} from "../framework/QbCoreClientFramework";


export class QbClientInventory extends ClientInventory {
  getPlayerInventory(framework?: ClientFramework): unknown {
    if (framework instanceof QbCoreClientFramework) {
      return (framework.getPlayerData() as any).items
    }
    return super.getPlayerInventory(framework);
  }

  getItemData(item: string, framework?: ClientFramework): unknown {
    if (framework instanceof QbCoreClientFramework) {
      return framework.QBCORE.Shared.Items[item]
    }
    return super.getItemData(item, framework);
  }
}
