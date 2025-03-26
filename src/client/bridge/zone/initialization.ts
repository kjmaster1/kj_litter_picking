import {FrozenPedTargetZone} from "./FrozenPedTargetZone";
import {Point} from "@overextended/ox_lib/client";
import Config from "../../../common/config";
import Locale from "../../../common/locale";
import {OxTargetOptions} from "../target/OxTarget";
import {QbTargetParameters} from "../target/QbTarget";
import {InteractTargetData} from "../target/InteractTarget";
import {deepMerge} from "../utils";
import {Vector4} from "@nativewrappers/fivem";

export const frozenPedTargetZone: FrozenPedTargetZone = makeLitterPickingZone();


function makeLitterPickingZone() {

  const point = new Point({
    coords: Config.setup.zoneLocation,
    distance: Config.setup.zoneDistance
  })

  const label = Locale('target.litter-picking-ped-target') as string;
  const name = 'litter-picking-ped-target';
  const icon = "fa-solid fa-exclamation-mark"

  const oxTargetData: OxTargetOptions = {
    label: label,
    name: name,
    icon: icon,
  }

  const qbTargetData: QbTargetParameters = {
    options: {
      label: label
    },
    distance: 2
  }

  const interactTargetData: InteractTargetData = {
    name: name,
    id: name,
    options: {
      label: label,
    }
  }

  const targetData = deepMerge(oxTargetData, qbTargetData, interactTargetData);

  return new FrozenPedTargetZone(
    point,
    targetData,
    undefined,
    Config.setup.pedModel,
    new Vector4(Config.setup.pedLocation[0], Config.setup.pedLocation[1], Config.setup.pedLocation[2], Config.setup.pedLocation[3]),
    Config.setup.pedScenario
  )
}
