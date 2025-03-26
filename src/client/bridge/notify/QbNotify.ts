import {NotifyBase} from "./NotifyBase";
import {clientFramework} from "../../index";
import {QbCoreClientFramework} from "../framework/QbCoreClientFramework";
import {QboxClientFramework} from "../framework/QboxClientFramework";

export class QbNotify extends NotifyBase {

  showNotification(message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) {
    if (clientFramework instanceof QbCoreClientFramework || clientFramework instanceof QboxClientFramework) {
      clientFramework.QBCORE.Functions.Notify(message, type);
    }
    console.error('Qb notifications selected but no detection of a QB framework!')
    super.showNotification(message, type, title, position, duration, playSound, icon);
  }
}
