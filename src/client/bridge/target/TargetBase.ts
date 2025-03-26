import {InteractTargetData} from "./InteractTarget";
import {OxTargetOptions} from "./OxTarget";
import {QbTargetParameters} from "./QbTarget";

export class TargetBase {

  constructor(readonly name: string) {}

  addTargetEntity(entity: number, data: InteractTargetData & OxTargetOptions & QbTargetParameters) {
    console.error('^1[ERROR]: No interaction system was detected - please visit the config in static folder!^0');
  }

  removeTargetEntity(entity: number, data: any) {
    console.error('^1[ERROR]: No interaction system was detected - please visit the config in static folder!^0');
  }
}
