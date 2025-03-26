import {oxmysql as MySQL} from "@overextended/oxmysql/MySQL";
import {MariaDBValue, PlayerData} from "../../../common/interface";


export abstract class ResourceTable {
  protected playerDataCache: Record<string | number, PlayerData> = {};

  protected constructor(protected readonly tableName:string, protected readonly columnNames: string[], protected readonly defaultCreationValues: MariaDBValue[]) {}

  public async createTableIfNotExists() {
    if (this.columnNames.length === 0 || this.defaultCreationValues.length === 0) return;

    const primaryDefaultValue = this.defaultCreationValues[0];
    if (typeof primaryDefaultValue !== "string" && typeof primaryDefaultValue !== "number") {
      console.error("Primary key must be a string or number!");
    }

    // Generate column definitions by inferring types from default values
    const columnDefinitions = this.columnNames.map((columnName, index) => {
      const value = this.defaultCreationValues[index];
      let sqlType = 'VARCHAR(255)'; // Default to VARCHAR(255) for string

      if (typeof value === 'number') {
        sqlType = Number.isInteger(value) ? 'INT' : 'FLOAT';
      } else if (typeof value === 'boolean') {
        sqlType = 'BOOLEAN';
      } else if (value instanceof Date) {
        sqlType = 'DATETIME';
      } else if (value === null) {
        // Try using VARCHAR(255) for undetermined
        sqlType = 'VARCHAR(255)';
      }

      const isPrimaryKey = index === 0 ? 'PRIMARY KEY' : '';
      return `${columnName} ${sqlType} ${isPrimaryKey}`.trim();
    });

    const query = `CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (${columnDefinitions.join(', ')})`;

    try {
      await MySQL.query(query);
    } catch (error) {
      console.error('Error creating table:', error);
    }
    return this;
  }

  protected async insertPlayer(defaultPlayerValues: MariaDBValue[]) {
    if (this.columnNames.length === 0 || defaultPlayerValues.length === 0) return;
    if (this.columnNames.length !== this.defaultCreationValues.length) {
      console.error('The length of column names array and default values array must match!');
      return;
    }
    if (this.defaultCreationValues.length !== defaultPlayerValues.length) {
      console.error('The length of passed in default values array and default values from creation must match!');
    }

    // Ensure table exists
    await this.createTableIfNotExists();

    // Create the column and values placeholders
    const columns = this.columnNames.join(', ');
    const placeholders = this.columnNames.map(() => '?').join(', ');

    // Form the final query using template literals
    const query = `INSERT INTO \`${this.tableName}\` (${columns}) VALUES (${placeholders})`;

    // Use values for parameterized query
    try {
      await MySQL.insert(query, defaultPlayerValues);
    } catch (error) {
      console.error('Error inserting player data:', error);
      return;
    }

    // Cache data using the first value (assumed to be primary key)
    if (typeof defaultPlayerValues[0] !== 'string' && typeof defaultPlayerValues[0] !== 'number') {
      console.error('Invalid cache key. Ensure the first column is a string or number primary identifier.');
      return;
    }
    const cacheKey = defaultPlayerValues[0]
    if (!cacheKey) {
    }

    this.playerDataCache[cacheKey] = this.columnNames.reduce((acc, columnName, index) => {
      acc[columnName] = defaultPlayerValues[index];
      return acc;
    }, {} as PlayerData);

    return this.playerDataCache[cacheKey];
  }

  protected async getPlayerData(primaryKeyValue: string | number, defaultPlayerValues: MariaDBValue[], playerDataKey?:string) {
    const primaryKeyName = this.columnNames[0];
    let data:PlayerData = this.playerDataCache[primaryKeyValue];
    if (!data) {
      const query = `SELECT * FROM \`${this.tableName}\` WHERE ${primaryKeyName} = ?`;
      const playerDatas = await MySQL.query<PlayerData[]>(query, [primaryKeyValue]);
      if (playerDatas && playerDatas.length > 0) {
        data = playerDatas[0];
        this.playerDataCache[primaryKeyValue] = data;
      } else {
        data = await this.insertPlayer(defaultPlayerValues);
        if (!data) return null;
      }
    }
    if (playerDataKey) return data[playerDataKey];
    return data;
  }

  protected async addPlayerData(primaryKeyValue: string | number, defaultPlayerValues: MariaDBValue[], playerDataKey:string, amount: number) {
    const data = await this.getPlayerData(primaryKeyValue, defaultPlayerValues) as PlayerData;
    if (!data) return;
    if (data.hasOwnProperty(playerDataKey)) {
      if (typeof data[playerDataKey] === 'number') {
        this.playerDataCache[primaryKeyValue][playerDataKey] = data[playerDataKey] + amount;
      }
    }
  }

  protected async savePlayerData(primaryKeyValue: string | number) {
    const data = this.playerDataCache[primaryKeyValue];
    if (!data) return;
    const primaryKeyName = this.columnNames[0];
    const placeholders = this.columnNames.map((value) => `\`${value}\` = ?`).join(', ');
    const query = `UPDATE \`${this.tableName}\` SET ${placeholders} WHERE ${primaryKeyName} = ?`
    let dataValues:MariaDBValue[] = []
    for (let dataKey in data) {
      dataValues.push(data[dataKey]);
    }
    dataValues.push(primaryKeyValue)
    await MySQL.update(query, dataValues);
    if (this.playerDataCache[primaryKeyValue]) {
      this.playerDataCache[primaryKeyValue] = undefined;
    }
  }
}
