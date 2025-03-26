import {Vector4} from "@nativewrappers/fivem";
import {target} from "../../index";
import lib, {Point} from "@overextended/ox_lib/client";
import {InteractTargetData} from "../target/InteractTarget";
import {OxTargetOptions} from "../target/OxTarget";
import {QbTargetParameters} from "../target/QbTarget";

export class FrozenPedTargetZone {

  constructor(readonly zone: Point, private targetData: InteractTargetData & OxTargetOptions & QbTargetParameters, public ped:number, readonly pedModel: string, readonly pedLocation: Vector4, readonly pedScenario?: string) {}

  setTargetDataOnSelect(onSelect: Function) {
    this.targetData.onSelect = onSelect;
    this.targetData.options.action = onSelect;
  }

  createZone() {
    this.zone.onEnter = async () => {
      if (!this.ped) {
        this.ped = await this.spawnPed(this.pedModel, this.pedLocation);
        if (this.pedScenario) {
          TaskStartScenarioInPlace(this.ped, this.pedScenario, -1, true);
        }
      }
      this.targetData.entity = this.ped;
      target.addTargetEntity(this.ped, this.targetData);
    }

    this.zone.onExit = () => {
      if (this.ped && DoesEntityExist(this.ped)) {
        DeleteEntity(this.ped);
        SetModelAsNoLongerNeeded(this.pedModel);
      }
      target.removeTargetEntity(this.ped, this.targetData.id);
      this.ped = undefined;
    };
  }

  protected async spawnPed(model: string, position: Vector4): Promise<number> {
    await lib.requestModel(model)
    const ped = CreatePed(0, model, position.x, position.y, position.z - 1.0, position.w, false, true)
    FreezeEntityPosition(ped, true)
    SetBlockingOfNonTemporaryEvents(ped, true)
    SetEntityInvincible(ped, true)
    return ped
  }
}
