import {ProgressBar} from "./ProgressBar";

export interface QbControlDisablesTable {
  disableMovement?: boolean; // false
  disableCarMovement?: boolean; // false
  disableMouse?: boolean; // false
  disableCombat?: boolean; // false
}

export interface QbAnimationTable {
  animDict?: string; // Nil
  anim?: string; // Nil
  flags?: number; // 0
  task?: string; // Nil
}

export interface QbPropTable {
  model?: string; // Nil
  bone?: number; // Nil
  coords?: { x?: number, y?: number, z?: number}; // {0.0, 0.0, 0.0}
  rotation?: { x?: number, y?: number, z?: number}; // {0.0, 0.0, 0.0}
}

export interface QbProgressBarTable {
  name: string;
  duration: number;
  label: string;
  useWhileDead?: boolean; // false
  canCancel?: boolean; // true
  disarm?: boolean; // true
  controlDisables?: QbControlDisablesTable;
  animation?: QbAnimationTable;
  prop?: QbPropTable;
  propTwo?: QbPropTable;
}

export class QbProgressBar extends ProgressBar {

  constructor(readonly progressBarTable: QbProgressBarTable) {
    super();
  }

  async doProgressBar() {
    return await new Promise<boolean>((resolve) => {
      // @ts-expect-error From LUA export
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      QBCore.Functions.Progressbar(
        this.progressBarTable.name,
        this.progressBarTable.label,
        this.progressBarTable.duration,
        this.progressBarTable.useWhileDead,
        this.progressBarTable.canCancel,
        this.progressBarTable.controlDisables,
        this.progressBarTable.animation,
        this.progressBarTable.prop,
        this.progressBarTable.propTwo,
        () => resolve(true), // On success
        () => resolve(false) // On cancel or fail
      );
    });
  }
}
