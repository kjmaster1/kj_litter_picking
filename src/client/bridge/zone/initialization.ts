import {FrozenPedTargetZone} from "./FrozenPedTargetZone";
import {Point} from "@overextended/ox_lib/client";
import Config from "../../../common/config";
import Locale from "../../../common/locale";
import {OxTargetOptions} from "../target/OxTarget";
import {QbTargetParameters} from "../target/QbTarget";
import {InteractTargetData} from "../target/InteractTarget";
import {deepMerge} from "../utils";
import {Vector3, Vector4} from "@nativewrappers/fivem";
import {LitterTargetZone, LitterZoneTable} from "../../litter/LitterTargetZone";
import {LitterTable, LitterZone} from "../../litter/LitterZone";

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

const litterPickingTarget = makeLitterPickingTarget();

export function makeLitterTargetZones(): LitterTargetZone[] {

  const litterTargetZones: LitterTargetZone[] = [];
  const zones = Config.picking.zones;
  zones.forEach((litterTargetZone) => {

    const point = new Point({
      coords: litterTargetZone.center,
      distance: litterTargetZone.distance,
    })

    const litterZones = litterTargetZone.litterSpawns
    const litterZonesTable: LitterZoneTable = {}
    litterZones.forEach((zone, index) => {
      const litterTable:LitterTable = {}
      const litters = zone.litter;
      litters.forEach((litter, index) => {
        litterTable[index] = new Vector3(litter[0], litter[1], litter[2]);
      })
      litterZonesTable[index] = new LitterZone([], zone.models, zone.level, zone.duration, zone.reward, zone.xp, zone.respawn, litterTable);
    })
    litterTargetZones.push(new LitterTargetZone(point, litterPickingTarget, litterZonesTable))
  })
  return litterTargetZones;
}

function makeLitterPickingTarget(): InteractTargetData & OxTargetOptions & QbTargetParameters {
  const label = Locale('target.litter-picking-litter-target') as string;
  const name = 'litter-picking-litter-target';
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

  return deepMerge(oxTargetData, qbTargetData, interactTargetData);
}




