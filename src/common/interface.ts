export type MariaDBValue = string | number | boolean | Date | null;

export interface PlayerData {
  [key: string]: MariaDBValue;
}

export interface TopPlayerData {
  name: string;
  level: number;
  exp: number;
  stat: number;
}

export interface ShopItem {
  item: string;
  price: number;
  icon: string;
  metadata?: {
    durability: number;
  };
  level?: number;
}

export interface ShopItems {
  [key: string]: ShopItem;
}
