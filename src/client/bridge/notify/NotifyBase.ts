export class NotifyBase {

  constructor(readonly name: string) {}

  showNotification(message:string, type:string, title?: string, position?: string, duration?:number, playSound?: boolean, icon?: string):void {
    console.error('Fell through to base notification, please setup a notification resource in config!')
  }
}
