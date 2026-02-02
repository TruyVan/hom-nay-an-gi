import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FoodItem } from '../../types';
import { Button } from '../Button';

interface OmakaseProps {
  items: FoodItem[];
  onComplete: (winner: FoodItem) => void;
}

export const Omakase = ({ items, onComplete }: OmakaseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);

  const handleOpen = () => {
    if (isOpen) {
        // Reset (Đóng nắp lại)
        setIsOpen(false);
        return;
    }
    // Chọn món ngẫu nhiên
    const random = items[Math.floor(Math.random() * items.length)];
    setCurrentFood(random);
    setIsOpen(true);
    setTimeout(() => onComplete(random), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="relative w-64 h-64 flex items-end justify-center mb-8">
        {/* Đĩa thức ăn */}
        <div className="absolute bottom-0 w-60 h-16 bg-white rounded-[50%] shadow-xl border border-gray-100 z-0" />
        
        {/* Món ăn (Hiện ra khi mở) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isOpen ? { opacity: 1, scale: 1, y: -20 } : { opacity: 0, scale: 0.5 }}
            className="z-10 text-center"
        >
            <div className="text-6xl mb-2">🍱</div>
            {currentFood && <div className="font-bold text-[#FF9A9E] bg-white/80 px-4 py-1 rounded-full backdrop-blur-md">{currentFood.name}</div>}
        </motion.div>

        {/* Lồng bàn (Nắp đậy) */}
        <motion.div
            initial={{ y: 0 }}
            animate={isOpen ? { y: -150, opacity: 0.8 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute bottom-4 w-56 h-48 bg-gradient-to-b from-[#FAD0C4] to-[#FF9A9E] rounded-t-[100px] z-20 shadow-2xl border-b-4 border-white/50 flex items-center justify-center"
        >
             <div className="w-6 h-6 bg-yellow-300 rounded-full absolute -top-3 shadow-lg border-2 border-white" />
        </motion.div>
        
        {/* Khói bay */}
        {isOpen && (
             <motion.div 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.5, 0], y: -100 }}
                transition={{ duration: 2 }}
                className="absolute z-30 text-4xl"
             >
                 ♨️
             </motion.div>
        )}
      </div>

      <Button onClick={handleOpen}>
        {isOpen ? 'Đậy nắp lại' : 'Mở nắp ra!'}
      </Button>
    </div>
  );
};