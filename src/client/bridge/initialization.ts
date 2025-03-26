import {ClientInventory} from "./inventory/ClientInventory";
import {OxClientInventory} from "./inventory/OxClientInventory";
import {QbClientInventory} from "./inventory/QbClientInventory";
import {QsClientInventory} from "./inventory/QsClientInventory";
import {PsClientInventory} from "./inventory/PsClientInventory";
import {OrigenClientInventory} from "./inventory/OrigenClientInventory";
import {CodemClientInventory} from "./inventory/CodemClientInventory";
import {CoreClientInventory} from "./inventory/CoreClientInventory";
import {ClientFramework} from "./framework/ClientFramework";
import {EsxClientFramework} from "./framework/EsxClientFramework";
import {QbCoreClientFramework} from "./framework/QbCoreClientFramework";
import {OxCoreClientFramework} from "./framework/OxCoreClientFramework";
import {QboxClientFramework} from "./framework/QboxClientFramework";
import {TargetBase} from "./target/TargetBase";
import Config from "../../common/config";
import {OxTarget} from "./target/OxTarget";
import {QbTarget} from "./target/QbTarget";
import {InteractTarget} from "./target/InteractTarget";
import {NotifyBase} from "./notify/NotifyBase";
import {OxLibNotify} from "./notify/OxLibNotify";
import {EsxNotify} from "./notify/EsxNotify";
import {QbNotify} from "./notify/QbNotify";
import {SdNotify} from "./notify/SdNotify";
import {WasabiNotify} from "./notify/WasabiNotify";
import {MiniGame} from "./minigame/MiniGame";
import {ProgressBar} from "./progress/ProgressBar";
import {cache} from "@overextended/ox_lib/client";
import {makeProgressBar} from "./progress/utils";
import {deepMerge} from "./utils";
import {OxProgressBarTable} from "./progress/OxProgressBar";
import {QbProgressBarTable} from "./progress/QbProgressBar";

export function initializeClientInventory(): ClientInventory {
  if (GetResourceState('ox_inventory') === 'started') {
    return new OxClientInventory('ox_inventory');
  } else if (GetResourceState("qb-inventory") === 'started') {
    return new QbClientInventory('qb-inventory');
  } else if (GetResourceState('qs-inventory') === 'started') {
    return new QsClientInventory('qs-inventory');
  } else if (GetResourceState('ps-inventory') === 'started') {
    return new PsClientInventory('ps-inventory');
  } else if (GetResourceState('origen_inventory') === 'started') {
    return new OrigenClientInventory('origen_inventory');
  } else if (GetResourceState('codem-inventory') === 'started') {
    return new CodemClientInventory('codem-inventory');
  } else if (GetResourceState('core_inventory') === 'started') {
    return new CoreClientInventory('core_inventory');
  }
  console.log("No inventory found, returning undefined...")
  return undefined;
}

export function initializeClientFramework(clientInventory: ClientInventory): ClientFramework {
  if (GetResourceState('es_extended') === 'started') {
    return new EsxClientFramework('esx', clientInventory);
  } else if (GetResourceState('qb-core') === 'started') {
    return new QbCoreClientFramework('qb', clientInventory);
  } else if (GetResourceState('ox_core') === 'started') {
    return new OxCoreClientFramework('ox', clientInventory);
  } else if (GetResourceState('qbx_core') === 'started') {
    return new QboxClientFramework(clientInventory);
  }
  console.error('No framework detected! Things will be very broken!')
  return undefined;
}

export function initializeTarget(): TargetBase {
  if (Config.setup.target === 'ox_target') {
    return new OxTarget('ox_target');
  } else if (Config.setup.target === 'qb-target') {
    return new QbTarget('qb-target');
  } else if (Config.setup.target === 'interact') {
    return new InteractTarget('interact');
  }
  console.log("No valid targeting resource specified in config, returning undefined...")
  return undefined;
}

export function initializeNotify(): NotifyBase {
  let notify: NotifyBase = undefined;
  if (Config.setup.notify === 'ox_lib') {
    notify = new OxLibNotify('ox_lib');
  } else if (Config.setup.notify === 'esx') {
    notify = new EsxNotify('esx');
  } else if (Config.setup.notify === 'qb') {
    notify = new QbNotify('qb');
  } else if (Config.setup.notify === 'sd-notify') {
    notify = new SdNotify('sd-notify');
  } else if (Config.setup.notify === 'wasabi-notify') {
    notify = new WasabiNotify('wasabi-notify');
  }
  if (!notify) console.log("No valid notification resource specified in config, returning undefined...")
  else {
    onNet(`${cache.resource}:notify`, (message: string, type: string, title?: string, position?: string, duration?: number, playSound?: boolean, icon?: string) => {
      notify.showNotification(message, type, title, position, duration, playSound, icon);
    })
  }
  return notify;
}

export function initializeMiniGame(): MiniGame {
  if (Config.setup.miniGame === 'ox_lib') {
    return new MiniGame();
  }
}

export function initializeProgressBar(): ProgressBar {

  const duration = 2000;
  const name = 'Drinking Water';
  const useWhileDead = false;
  const canCancel = false;
  const disableCar = true;
  const dict = 'mp_player_intdrink';
  const clip = 'loop_bottle';
  const model = 'prop_ld_flow_bottle';
  const coords = {x: 0.03, y: 0.03, z: 0.02};
  const rotation = {x: 0.0, y: 0.0, z: -1.5};

  const oxProgressBarData: OxProgressBarTable = {
    duration: duration,
    label: name,
    useWhileDead: useWhileDead,
    canCancel: canCancel,
    disable: {
      car: disableCar,
    },
    anim: {
      dict: dict,
      clip: clip
    },
    prop: {
      model: model,
      pos: coords,
      rot: rotation,
    }
  }

  const qbProgressBarData: QbProgressBarTable = {
    name: name,
    duration: duration,
    label: name,
    useWhileDead: useWhileDead,
    canCancel: canCancel,
    controlDisables: {
      disableCarMovement: disableCar,
    },
    animation: {
      animDict: dict,
      anim: dict
    },
    prop: {
      model: model,
      coords: coords,
      rotation: rotation,
    }
  }

  const progressBarData = deepMerge(oxProgressBarData, qbProgressBarData);

  return makeProgressBar(progressBarData);
}
