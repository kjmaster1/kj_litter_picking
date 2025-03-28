import {Vector3} from "@nativewrappers/fivem";

export interface LiterZoneDuration {
  min: number;
  max: number;
}

export interface LitterZoneReward {
  item: string;
  min: number;
  max: number;
}

export interface LitterZoneXp {
  min: number;
  max: number;
}

export interface LitterTable {
  [key: number]: Vector3;
}

export class LitterZone {

  constructor(public entities: number[], readonly models: string[], readonly level: number, readonly duration: LiterZoneDuration, readonly reward: LitterZoneReward[], readonly xp: LitterZoneXp, readonly respawn: number, readonly litterTable: LitterTable) {
  }
}
