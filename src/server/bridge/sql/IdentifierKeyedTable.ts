import {serverFramework} from "../../index";
import {ResourceTable} from "./ResourceTable";
import {MariaDBValue, PlayerData} from "../../../common/interface";

export abstract class IdentifierKeyedTable extends ResourceTable {

  // Primary Key is always player identifier
  protected constructor(tableName: string, columnNames: string[], defaultCreationValues: MariaDBValue[]) {
    columnNames.unshift('identifier')
    defaultCreationValues.unshift('')
    super(tableName, columnNames, defaultCreationValues);
  }

  protected async insertPlayerById(source: number, defaultValues: MariaDBValue[]): Promise<PlayerData> {
    if (!source) return;
    const identifier = serverFramework.getIdentifier(source);
    if (!identifier) return;
    defaultValues.unshift(identifier);
    return await this.insertPlayer(defaultValues)
  }

  protected async getPlayerDataById(source: number, defaultValues: MariaDBValue[], type?: string): Promise<MariaDBValue | PlayerData> {
    if (!source) return;
    const identifier = serverFramework.getIdentifier(source);
    if (!identifier) return;
    defaultValues.unshift(identifier);
    return this.getPlayerData(identifier, defaultValues, type);
  }

  protected async addPlayerDataById(source:number, defaultValues: MariaDBValue[], type: string, amount: number): Promise<void> {
    if (!source || !type || !amount) return;
    const identifier = serverFramework.getIdentifier(source);
    if (!identifier) return;
    defaultValues.unshift(identifier);
    await this.addPlayerData(identifier, defaultValues, type, amount);
  }

  protected async savePlayerDataById(source: number) {
    if (!source) return;
    const identifier = serverFramework.getIdentifier(source);
    if (!identifier) return;
    await this.savePlayerData(identifier);
  }
}
