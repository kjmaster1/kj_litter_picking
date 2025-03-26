import {OxProgressBar, OxProgressBarTable} from "./OxProgressBar";
import {QbProgressBar, QbProgressBarTable} from "./QbProgressBar";
import Config from "../../../common/config";
import {ProgressBar} from "./ProgressBar";

export function makeProgressBar(progressBarTable: OxProgressBarTable & QbProgressBarTable): ProgressBar {
  if (Config.setup.progressBar === 'ox_lib') {
    return new OxProgressBar(progressBarTable);
  } else if (Config.setup.progressBar === 'qb') {
    return new QbProgressBar(progressBarTable);
  }
  return undefined;
}
