import {TargetBase} from "./TargetBase";

interface QbTargetOptions {
  num?: number;
  type?: string;
  event?: string;
  icon?: string;
  label: string;
  targeticon?: string;
  item?: string;
  action?: Function;
  canInteract?: Function;
  job?: string | Record<string, unknown>;
  gang?: string | Record<string, unknown>;
}

export interface QbTargetParameters {
  options: QbTargetOptions;
  distance: number;
}

export class QbTarget extends TargetBase {

  addTargetEntity(entity: number, data: QbTargetParameters) {
    exports['qb-target'].AddTargetEntity(entity, data);
  }

  removeTargetEntity(entity: number, data: any) {
    exports['qb-target'].RemoveTargetEntity(entity, data);
  }
}
