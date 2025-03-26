import {IdentifierKeyedTable} from "./IdentifierKeyedTable";
import {serverFramework} from "../../index";
import {cache} from "@overextended/ox_lib/client";
import { oxmysql as MySQL } from "@overextended/oxmysql/MySQL";
import {MariaDBValue, PlayerData, TopPlayerData} from "@common/interface";

export class ExperienceTable extends IdentifierKeyedTable {

  constructor(tableName:string, readonly statName: string) {
    super(
      tableName,
      ['name', 'level', 'exp', statName, 'earned'],
      ['', 1, 0, 0, 0]
    );
  }

  public async getPlayerDataBySource(source: number, type?: string): Promise<MariaDBValue | PlayerData> {
    return await this.getPlayerDataById(source, [serverFramework.getName(source), 1, 0, 0, 0], type);
  }

  public async addPlayerDataBySource(source: number, type:string, amount: number): Promise<void> {
    return await this.addPlayerDataById(source, [serverFramework.getName(source), 1, 0, 0, 0], type, amount);
  }

  public async savePlayerDataBySource(source: number) {
    await this.savePlayerDataById(source);
  }

  public async getTopPlayers() {
    const query =
      ` SELECT name, level, exp, ${this.statName}\n` +
      ` FROM \`${cache.resource}\`\n` +
      ` ORDER BY exp DESC\n` +
      ` LIMIT 10`;
    const response = await MySQL.query<PlayerData[]>(query);
    const players: TopPlayerData[] = []
    if (response) {
      response.forEach((player: PlayerData) => {
        players.push({
          name: player['name'] as string,
          level: player['level'] as number,
          exp: player['exp'] as number,
          stat: player[this.statName] as number,
        })
      })
    }
    return players;
  }
}
