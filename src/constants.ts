import type { FoodItem } from './types';

export const COLORS = {
  primary: '#FF9A9E',
  secondary: '#FAD0C4',
  accent: '#A1C4FD',
  glass: 'rgba(255, 255, 255, 0.25)',
  text: '#4A4A4A',
};

export const INITIAL_FOODS: FoodItem[] = [
  { id: '1', name: 'Phở Bò Tái Nạm', address: 'Phở Thìn - 13 Lò Đúc', active: true },
  { id: '2', name: 'Bún Đậu Mắm Tôm', address: 'Ngõ 31 Hàng Khay', active: true },
  { id: '3', name: 'Pizza 4P\'s', address: 'Tràng Tiền Plaza', active: true },
  { id: '4', name: 'Lẩu Haidilao', address: 'Vincom Phạm Ngọc Thạch', active: true },
  { id: '5', name: 'Cơm Tấm Sườn', address: 'Cơm Tấm Sà Bì Chưởng', active: true },
  { id: '6', name: 'Sushi Omakase', address: 'Sushi Hokkaido Sachi', active: true },
  { id: '7', name: 'Mì Trộn Jolibee', address: 'Jolibee Aeon Mall', active: true }, // Món tủ anh thích nè
  { id: '8', name: 'Gà Rán Popeyes', address: 'Popeyes Times City', active: true },
];