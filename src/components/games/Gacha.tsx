import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../../types';
import { Button } from '../Button';

export const Gacha = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [droppedBall, setDroppedBall] = useState<FoodItem | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  
  const gachaItems = items.slice(0, 20);

  // Tạo vị trí ngẫu nhiên cho bóng trong lồng (Lăn lộn xộn)
  const balls = useMemo(() => gachaItems.map((item, i) => ({
    ...item,
    x: Math.random() * 100 - 50,
    y: Math.random() * 40 + 160,
    color: ['#FF9A9E', '#FAD0C4', '#A1C4FD', '#C2E9FB', '#FECFEF'][i % 5]
  })), [items]);

  const handleSpin = () => {
    if (isSpinning || isOpening) return;
    setIsSpinning(true); 
    setDroppedBall(null);
    setIsOpening(false);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = gachaItems[Math.floor(Math.random() * gachaItems.length)];
      setDroppedBall(winner);
    }, 2500);
  };

  const handleOpenBall = () => {
    if (!droppedBall || isOpening) return;
    setIsOpening(true);

    // Hiệu ứng "Bùm" sau khi rung lắc
    setTimeout(() => {
      onComplete(droppedBall);
      // Reset trạng thái sau khi hoàn thành để có thể quay tiếp
      setDroppedBall(null);
      setIsOpening(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center py-4 h-full justify-around select-none">
      <div className="relative w-80 h-96 flex flex-col items-center">
        
        {/* 1. Lồng bóng tròn trịa */}
        <div className="w-64 h-64 bg-white/40 border-8 border-white rounded-full relative overflow-hidden backdrop-blur-md shadow-inner z-10">
          <AnimatePresence>
            {balls.map((ball, i) => (
              <motion.div
                key={ball.id}
                animate={isSpinning ? { 
                  x: [ball.x, Math.random() * 160 - 80, Math.random() * 160 - 80, ball.x],
                  y: [ball.y, Math.random() * 120 - 60, Math.random() * 150 - 100, ball.y],
                  rotate: [0, Math.random() * 360, Math.random() * -360, 0]
                } : { x: ball.x, y: ball.y }}
                transition={{ 
                  duration: 0.4 + Math.random() * 0.2, 
                  repeat: isSpinning ? Infinity : 0, 
                  ease: "easeInOut",
                  delay: i * 0.01 
                }}
                className="absolute w-10 h-10 rounded-full shadow-lg border-2 border-white/40"
                style={{ backgroundColor: ball.color, left: '40%' }}
              />
            ))} 
          </AnimatePresence>
        </div>
        
        {/* 2. Thân máy & Khe thoát bóng */}
        <div className="w-48 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-[40px] relative -mt-6 shadow-2xl border-t-4 border-white/50 z-0 flex flex-col items-center">
           {/* Núm vặn */}
           <motion.div 
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0, ease: "linear" }}
            className="w-12 h-12 bg-white rounded-full shadow-inner mt-2 flex items-center justify-center border-2 border-gray-300"
           >
              <div className="w-1.5 h-8 bg-gray-400 rounded-full" />
           </motion.div>

           {/* Khay chứa bóng rơi (Slot) */}
           <div className="absolute bottom-3 w-20 h-10 bg-black/30 rounded-t-2xl border-t-2 border-black/40 shadow-inner" />
        </div>

        {/* 3. Quả bóng trúng thưởng - Rơi từ máy xuống khay */}
        <AnimatePresence>
          {droppedBall && (
            <motion.div
              layoutId="gacha-ball"
              initial={{ y: -60, x: 0, opacity: 0, scale: 0.5 }}
              animate={isOpening ? {
                // Animation khi đang mở: Rung lắc dữ dội rồi nở to
                scale: [1, 1.2, 0.8, 1.5, 2],
                rotate: [0, -10, 10, -10, 10, 0],
                opacity: [1, 1, 1, 1, 0],
                y: 115,
              } : { 
                y: 115, // Rơi xuống đúng khay chứa
                x: 0, 
                opacity: 1, 
                scale: 1,
              }}
              exit={{ scale: 3, opacity: 0 }}
              onClick={handleOpenBall}
              className={`absolute z-20 cursor-pointer w-14 h-14 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-2xl
                ${isOpening ? '' : 'hover:scale-110 active:scale-90 transition-transform'}
              `}
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, #ffd700, #ff8c00)',
                top: '50%'
              }}
            >
              {/* Hiệu ứng hào quang khi bóng rơi ra */}
              {!isOpening && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-[-8px] rounded-full bg-yellow-400/30 blur-md -z-10"
                />
              )}
              {isOpening ? "✨" : "🎁"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Điều khiển */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <Button 
            onClick={handleSpin} 
            disabled={isSpinning || isOpening || droppedBall !== null}
            className={droppedBall ? "opacity-50" : ""}
        >
          {isSpinning ? 'Đang quay...' : droppedBall ? 'Mở quà đi!' : 'Quay Ngay'}
        </Button>
        
        <p className="text-[11px] text-gray-400 font-medium h-4">
          {droppedBall && !isOpening && "❤️ Chạm vào quả bóng để khui món ngon nha!"}
          {isOpening && "🧨 Đang mở quà... Hồi hộp quá!"}
        </p>
      </div>
    </div>
  );
};