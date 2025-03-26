import {NotifyBase} from "./NotifyBase";

export class OkOkNotify extends NotifyBase {
  showNotification(message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) {
    exports['okokNotify'].Alert(title, message, duration, type, playSound)
  }
}
