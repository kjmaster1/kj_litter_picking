import {NotifyBase} from "./NotifyBase";
import {clientFramework} from "../../index";
import {EsxClientFramework} from "../framework/EsxClientFramework";

export class EsxNotify extends NotifyBase {

  showNotification(message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) {
    if (clientFramework instanceof EsxClientFramework) {
      clientFramework.ESX.ShowNotification(message)
    } else {
      console.error('Esx notifications selected but no detection of Esx framework!')
      super.showNotification(message, type, title, position, duration, playSound, icon);
    }
  }
}
