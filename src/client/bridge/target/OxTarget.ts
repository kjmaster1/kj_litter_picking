import {TargetBase} from "./TargetBase";
import {Vector3} from "@nativewrappers/fivem";

export interface OxTargetOptions {
  label: string;
  name?: string;
  icon?: string;
  iconColor?: string;
  distance?: number;
  bones?: string | string[];
  offset?: Vector3;
  offsetAbsolute?: Vector3;
  offsetSize?: number;
  groups?: string | string[] | Record<string, number>;
  items?: string | string[] | Record<string, number>;
  anyItem?: boolean;
  canInteract?: (entity: number, distance: number, coords: Vector3, name: string, bone: number) => boolean;
  menuName?: string;
  openMenu? : string;
  onSelect?: Function;
  export?: string;
  event?: string;
  serverEvent?: string;
  command?: string;
}

export class OxTarget extends TargetBase {

  addTargetEntity(entity: number, data: OxTargetOptions) {
    exports.ox_target.addLocalEntity(entity, data);
  }

  removeTargetEntity(entity: number, data: string | string[]) {
    exports.ox_target.removeLocalEntity(entity, data);
  }
}
