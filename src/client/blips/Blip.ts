import {Vector3, Vector4} from "@nativewrappers/fivem";

export interface BlipData {
  enable: boolean;
  sprite: number;
  color: number;
  scale: number;
  label: string
}

export class Blip {

  blip: number;

  constructor(readonly data: BlipData) {
  }

  displayBlip(coords: Vector3 | Vector4,) {
    if (!this.data.enable) return;
    this.blip = AddBlipForCoord(coords.x, coords.y, coords.z);
    SetBlipSprite(this.blip, this.data.sprite);
    SetBlipColour(this.blip, this.data.color);
    SetBlipScale(this.blip, this.data.scale);
    SetBlipAsShortRange(this.blip, true);
    BeginTextCommandSetBlipName("STRING");
    AddTextComponentString(this.data.label);
    EndTextCommandSetBlipName(this.blip);
  }

  removeBlip() {
    RemoveBlip(this.blip);
  }
}
