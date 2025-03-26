import {TargetBase} from "./TargetBase";
import {Vector3} from "@nativewrappers/fivem";



export interface InteractTargetData {
  entity?: number;
  name?: string;
  id: string;
  distance?: number;
  interactDst?: number;
  ignoreLos?: boolean;
  offset?: Vector3;
  bone?: string;
  groups?: Record<string, number>;
  options: {
    label: string;
    action?: Function;
  }
}

export class InteractTarget extends TargetBase {

  addTargetEntity(entity: number, data: InteractTargetData) {
    exports.interact.AddLocalEntityInteraction(data);
  }

  removeTargetEntity(entity: number, data: any) {
    exports.interact.RemoveLocalEntityInteract(entity, data);
  }
}
