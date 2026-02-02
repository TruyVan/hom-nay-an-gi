export interface FoodItem {
  id: string;
  name: string;
  address?: string; // Địa chỉ quán
  active: boolean;
}

export interface HistoryItem {
  id: string;
  foodName: string;
  address?: string;
  timestamp: string;
}

export type GameMode = 'gacha' | 'scratch' | 'omakase' | 'racing' | 'wheel' | 'gift';