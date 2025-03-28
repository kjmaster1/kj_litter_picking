import {ProgressBar} from "./ProgressBar";
import lib from "@overextended/ox_lib/client";

export interface OxAnimTable {
  dict?: string;
  clip: string;
  flag?: number;
  blendIn?: number;
  blendOut?: number;
  duration?: number;
  playbackRate?: number;
  lockX?: boolean;
  lockY?: boolean;
  lockZ?: boolean;
  scenario?: string;
  playEnter?: boolean;
}

export interface OxPropTable {
  model: string;
  bone?: number;
  pos: {x :number, y:number, z:number};
  rot: {x :number, y:number, z:number};
  rotOrder?: number;
}

export interface OxDisableTable {
  move?: boolean;
  car?: boolean;
  combat?: boolean;
  mouse?: boolean;
  sprint?: boolean;
}

export interface OxProgressBarTable {
  duration: number;
  label: string;
  useWhileDead?: boolean;
  allowRagdoll?: boolean;
  allowSwimming?: boolean;
  allowCuffed?: boolean;
  allowFalling?: boolean;
  canCancel?: boolean;
  anim?: OxAnimTable;
  prop?: OxPropTable | OxPropTable[];
  disable?: OxDisableTable;
}

export class OxProgressBar extends ProgressBar {

  constructor(readonly progressBarTable: OxProgressBarTable) {
    super();
  }

  async doProgressBar() {
    return await lib.progressBar(this.progressBarTable);
  }
}
