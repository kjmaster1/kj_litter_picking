import {ServerInventory} from "./inventory/ServerInventory";
import {OxServerInventory} from "./inventory/OxServerInventory";
import {QbServerInventory} from "./inventory/QbServerInventory";
import {PsServerInventory} from "./inventory/PsServerInventory";
import {CoreServerInventory} from "./inventory/CoreServerInventory";
import {CodemInventory} from "./inventory/CodemInventory";
import {ServerFramework} from "./framework/ServerFramework";
import {EsxServerFramework} from "./framework/EsxServerFramework";
import {QboxServerFramework} from "./framework/QboxServerFramework";
import {QbCoreServerFramework} from "./framework/QbCoreServerFramework";
import {OxCoreServerFramework} from "./framework/OxCoreServerFramework";

export function initializeServerInventory(): ServerInventory {
  if (GetResourceState('ox_inventory') === 'started') {
    return new OxServerInventory('ox_inventory');
  } else if (GetResourceState("qb-inventory") === 'started') {
    return new QbServerInventory('qb-inventory');
  } else if (GetResourceState('qs-inventory') === 'started') {
    return new ServerInventory('qs-inventory');
  } else if (GetResourceState('ps-inventory') === 'started') {
    return new PsServerInventory('ps-inventory');
  } else if (GetResourceState('origen_inventory') === 'started') {
    return new ServerInventory('origen_inventory');
  } else if (GetResourceState('codem-inventory') === 'started') {
    return new CodemInventory('codem-inventory');
  } else if (GetResourceState('core_inventory') === 'started') {
    return new CoreServerInventory('core_inventory');
  }
  return undefined;
}

export function initializeServerFramework(serverInventory: ServerInventory): ServerFramework {
  if (GetResourceState('es_extended') === 'started') {
    return new EsxServerFramework(serverInventory);
  } else if (GetResourceState('qbx_core') === 'started') {
    return  new QboxServerFramework(serverInventory);
  } else if (GetResourceState('qb-core') === 'started') {
    return  new QbCoreServerFramework('qb', serverInventory);
  } else if (GetResourceState('ox_core') === 'started') {
    return  new OxCoreServerFramework(serverInventory);
  }
}
