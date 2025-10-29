import lib, {cache, Point} from "@overextended/ox_lib/client";
import {LitterZone} from "./LitterZone";
import {clientFramework, notify, pickingProgressBar, target} from "../index";
import Locale from "../../shared/locale";
import Config from "../../shared/config";
import {
  InteractTargetData,
  OxProgressBar,
  OxTargetOptions,
  QbProgressBar,
  QbTargetParameters
} from "@kjmaster2/kj_lib/client";
import {Delay, randomIntFromInterval} from "@kjmaster2/kj_lib";

export interface LitterZoneTable {
  [key: number]: LitterZone;
}

export interface EntityRespawnTable {
  entity: number;
  respawn: number;
}

export interface LitterEntityRespawnTable {
  [key: number]: EntityRespawnTable;
}

export interface ZoneEntityRespawnTable {
  [key: number]: LitterEntityRespawnTable;
}

const litter_picking = exports.kj_litter_picking;

export class LitterTargetZone {

  zoneEntityRespawnTable: ZoneEntityRespawnTable = {};
  inside: boolean = false;
  isRunning = true;

  constructor(readonly zone: Point, private targetData: InteractTargetData & OxTargetOptions & QbTargetParameters, readonly litterZones: LitterZoneTable) {
  }

  setTargetDataOnSelect(onSelect: Function) {
    this.targetData.onSelect = onSelect;
    this.targetData.options.action = onSelect;
  }

  createZone() {
    this.zone.onEnter = async () => {
      this.inside = true;
      for (const zoneId in this.litterZones) {
        const litterZone = this.litterZones[zoneId];
        for (const litterId in litterZone.litterTable) {
          await this.spawnLitter(Number(zoneId), Number(litterId));
        }
      }
    }

    this.zone.onExit = () => {
      this.inside = false;
      for (const zoneId in this.zoneEntityRespawnTable) {
        const litterEntityRespawnTable = this.zoneEntityRespawnTable[zoneId];
        for (const litterId in litterEntityRespawnTable) {
          const entityRespawnTable = litterEntityRespawnTable[litterId];
          if (entityRespawnTable.entity && DoesEntityExist(entityRespawnTable.entity)) {
            DeleteEntity(entityRespawnTable.entity);
          }
        }
        this.zoneEntityRespawnTable[zoneId] = undefined;
      }
      for (const key in this.litterZones) {
        const litterZone = this.litterZones[key];
        for (const model in litterZone.models) {
          SetModelAsNoLongerNeeded(model);
        }
      }
    };
  }

  async doRespawns() {
    while (this.isRunning) {
      if (this.inside) {
        for (const zoneId in this.zoneEntityRespawnTable) {
          const litterEntityRespawnTable = this.zoneEntityRespawnTable[zoneId];
          for (const litterId in litterEntityRespawnTable) {
            const entityRespawnTable = litterEntityRespawnTable[litterId];
            if (entityRespawnTable.respawn && GetGameTimer() >= entityRespawnTable.respawn) {
              await this.spawnLitter(Number(zoneId), Number(litterId));
            }
          }
        }
        await Delay(1000);
      } else {
        await Delay(10000);
      }
    }
  }

  protected async spawnLitter(zoneId: number, litterId: number) {
    const zone = this.litterZones[zoneId];
    const litter = zone.litterTable[litterId];
    const models = zone.models;
    const random = Math.floor(Math.random() * models.length);
    const model = models[random];
    await lib.requestModel(model);

    const randX = randomIntFromInterval(litter.x - 10, litter.x + 10);
    const randY = randomIntFromInterval(litter.y - 10, litter.y + 10);

    console.log(randX, randY, litter.z);

    const entity = CreateObject(model, randX, randY, litter.z, false, false, false);
    PlaceObjectOnGroundProperly(entity);
    FreezeEntityPosition(entity, true);
    this.setTargetDataOnSelect(async () => await this.pickLitter(zoneId, litterId))
    target.addTargetEntity(entity, this.targetData);

    if (!this.zoneEntityRespawnTable[zoneId]) {
      this.zoneEntityRespawnTable[zoneId] = {};
    }

    this.zoneEntityRespawnTable[zoneId][litterId] = {entity: entity, respawn: 0}
  }

  protected async pickLitter(zoneId: number, litterId: number) {

    console.log(`Picking Litter target zone id: ${zoneId}`);
    console.log(`Picking Litter target litter id: ${litterId}`);

    if (!this.litterZones[zoneId]) {
      console.error(`Zone ${zoneId} not found.`);
      return;
    }

    if (!this.litterZones[zoneId].litterTable[litterId]) {
      console.error(`Litter ${litterId} not found in zone ${zoneId}.`);
      return;
    }

    const zone = this.litterZones[zoneId];
    const litter = this.zoneEntityRespawnTable[zoneId] && this.zoneEntityRespawnTable[zoneId][litterId];
    if (!litter || !DoesEntityExist(litter.entity)) return;

    const level = await litter_picking.GetPlayerData("level") as number;
    if (level < zone.level) {
      notify.showNotification(clientFramework, <string>Locale('notify.not-experienced'), 'error');
      return;
    }

    let hasPicker: boolean = false;
    let pickerItem: string = undefined;
    const litterPickers = Config.pickers as Record<string, {"item": string, "degrade": number}>;

    console.log(litterPickers);

    Object.entries(litterPickers).forEach(([picker_level, picker_data]) => {
      console.log(level);
      console.log(Number(picker_level))
      console.log(Number(picker_level) <= level);
      console.log(clientFramework.hasItem(picker_data.item, 1));
      if (Number(picker_level) <= level && clientFramework.hasItem(picker_data.item, 1)) {
        hasPicker = true;
        pickerItem = picker_data.item;
      }
    });

    if (!hasPicker) {
      notify.showNotification(clientFramework, <string>Locale('notify.missing-item'), 'error')
      return;
    }

    const metadata = await lib.triggerServerCallback(`${cache.resource}:getMetadata`, null, pickerItem) as Record<string, unknown>;
    console.log(metadata);
    const metatype = clientFramework.getDurabilityType();
    const degrade = litterPickers[level.toString()].degrade;

    if (!metadata || !metadata[metatype] || (metadata[metatype] as number) < degrade) {
      notify.showNotification(clientFramework, Locale('notify.picker-no-durability') as string, 'error')
      return;
    }

    const hour = GetClockHours();
    const hours = Config.picking.hours as {min: number, max: number};
    if (hour < hours.min || hour > hours.max) {
      notify.showNotification(clientFramework, Locale('notify.nighttime') as string, 'error')
      return;
    }

    const duration = randomIntFromInterval(zone.duration.min, zone.duration.max);
    if (!duration) return;

    if (pickingProgressBar instanceof OxProgressBar || pickingProgressBar instanceof QbProgressBar) pickingProgressBar.progressBarTable.duration = duration;

    if (await pickingProgressBar.doProgressBar()) {
      DeleteEntity(litter.entity);
      this.zoneEntityRespawnTable[zoneId][litterId] = {entity: undefined, respawn: GetGameTimer() + zone.respawn}
      console.log("Picked a piece of litter!")
    }
  }
}
