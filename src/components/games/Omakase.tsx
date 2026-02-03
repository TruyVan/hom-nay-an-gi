import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../../types';

interface OmakaseProps {
  items: FoodItem[];
  onComplete: (winner: FoodItem) => void;
}

export const Omakase = ({ items, onComplete }: OmakaseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);

  const handleToggleLid = () => {
    if (isAnimating) return;

    if (isOpen) {
      // Logic đóng nắp khi muốn chọn lại
      setIsAnimating(true);
      setIsOpen(false);
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentFood(null);
      }, 800);
    } else {
      // Logic mở nắp khám phá món mới
      setIsAnimating(true);
      const random = items[Math.floor(Math.random() * items.length)];
      setCurrentFood(random);
      setIsOpen(true);
      
      // Chờ nắp bay lên + 1.5s để nhìn món rồi mới báo kết quả
      setTimeout(() => {
        setIsAnimating(false);
        onComplete(random);
      }, 2300); // 800ms (animation) + 1500ms (viewing time)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative select-none">
      <div className="relative w-80 h-80 flex items-end justify-center mb-4">
        
        {/* 1. Đĩa sứ trắng sang trọng */}
        <div className="absolute bottom-4 w-72 h-20 bg-gradient-to-b from-white to-gray-200 rounded-[50%] shadow-2xl border-b-8 border-gray-300 z-0" />
        
        {/* 2. Món ăn bí ẩn dưới nắp */}
        <AnimatePresence>
          {currentFood && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={isOpen ? { opacity: 1, scale: 1.2, y: -40 } : { opacity: 0, scale: 0.5, y: 0 }}
              className="z-10 text-center flex flex-col items-center"
            >
              <div className="text-7xl mb-4 drop-shadow-lg">🍱</div>
              <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl border border-pink-100">
                <p className="font-black text-[#FF9A9E] text-xl">{currentFood.name}</p>
                {currentFood.address && (
                  <p className="text-[10px] text-gray-400 font-bold italic mt-1">📍 {currentFood.address}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Lồng bàn (Cloche) - Tương tác trực tiếp */}
        <motion.div
          onClick={handleToggleLid}
          initial={{ y: 0 }}
          animate={isOpen ? { y: -180, rotate: -5, opacity: 0.9 } : { y: 0, rotate: 0, opacity: 1 }}
          whileHover={!isOpen && !isAnimating ? { scale: 1.02, y: -5 } : {}}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            duration: 0.8 
          }}
          className={`absolute bottom-8 w-64 h-52 z-20 cursor-pointer flex items-center justify-center
            ${!isOpen && !isAnimating ? 'hover:brightness-110' : ''}
          `}
        >
          {/* Quai cầm nắp vung */}
          <div className="absolute -top-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg border-4 border-white z-30" />
          
          {/* Thân nắp vung vàng óng */}
          <div className="w-full h-full bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 rounded-t-[120px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-b-8 border-white/40 relative overflow-hidden">
             {/* Hiệu ứng bóng đổ lấp lánh trên nắp */}
             <div className="absolute top-0 left-1/4 w-1/2 h-full bg-white/20 skew-x-12 blur-sm" />
             
             {/* Animation mời gọi khi chưa mở */}
             {!isOpen && !isAnimating && (
                <motion.div 
                   animate={{ opacity: [0, 0.5, 0] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 bg-white"
                />
             )}
          </div>
        </motion.div>
        
        {/* 4. Khói bay (Steam) - Chỉ hiện khi mở nắp */}
        {isOpen && (
          <div className="absolute z-30 bottom-24 pointer-events-none">
             {[1, 2, 3].map((i) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, y: 0, x: (i - 2) * 20 }}
                animate={{ opacity: [0, 0.6, 0], y: -150, x: (i - 2) * 30 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute text-4xl"
               >
                 ♨️
               </motion.div>
             ))}
          </div>
        )}
      </div>

      {/* 5. Hướng dẫn sử dụng đồng bộ */}
      <p className="mt-4 text-xs font-bold text-gray-400 animate-pulse">
        {isOpen ? "Chạm vào nắp vung để đóng lại ❤️" : "Chạm vào nắp vung để xem kết quả! ❤️"}
      </p>
    </div>
  );
};