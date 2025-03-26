import {NotifyBase} from "./NotifyBase";

export class WasabiNotify extends NotifyBase {

  showNotification(message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) {
    exports.wasabi_notify.notify(title, message, duration, type, playSound, icon)
  }
}
