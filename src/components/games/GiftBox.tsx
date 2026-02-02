import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../../types';

export const GiftBox = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [openingId, setOpeningId] = useState<string | null>(null);
  const displayItems = items.slice(0, 20);

  const handleOpen = (item: FoodItem) => {
    if (openingId) return;
    setOpeningId(item.id);

    setTimeout(() => {
      onComplete(item);
      setOpeningId(null);
    }, 1200);
  };

  return (
    // Thêm overflow-hidden ở đây để triệt tiêu scrollbar khi rung lắc
    <div className="w-full h-full flex flex-col p-4 overflow-hidden relative">
      {/* Grid container với padding đủ rộng để không chạm biên khi scale */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 p-10 overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar flex-1 content-start">
        {displayItems.map((item) => (
          <div key={item.id} className="relative flex items-center justify-center">
            <motion.div
              whileHover={!openingId ? { scale: 1.15, rotate: [0, -5, 5, -5, 0] } : {}}
              whileTap={!openingId ? { scale: 0.9 } : {}}
              onClick={() => handleOpen(item)}
              className="relative z-10 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {openingId === item.id ? (
                  <motion.div
                    key="opening"
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ 
                      scale: [1, 1.4, 0.9, 2.5],
                      rotate: [0, 15, -15, 30, 0],
                      opacity: [1, 1, 1, 0]
                    }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="text-6xl"
                  >
                    🎊
                  </motion.div>
                ) : (
                  <motion.div
                    key="static"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl md:text-7xl drop-shadow-lg"
                  >
                    🎁
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Đổ bóng dưới chân hộp quà */}
            <div className="absolute bottom-[-10px] w-14 h-3 bg-black/5 rounded-[50%] blur-md -z-10" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
        <p className="text-sm font-bold text-gray-500 italic flex items-center justify-center gap-2">
          {openingId ? (
            <>✨ <span className="animate-pulse">Đang khui điều bất ngờ dành cho anh...</span> ✨</>
          ) : (
            <>💖 Chọn một món quà mà bạn yêu thích nhất! 💖</>
          )}
        </p>
      </div>
    </div>
  );
};