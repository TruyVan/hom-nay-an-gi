import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../../types';

export const Gacha = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [droppedBall, setDroppedBall] = useState<FoodItem | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  
  const gachaItems = items.slice(0, 20);

  // Tạo vị trí ngẫu nhiên cho bóng nằm tự nhiên dưới đáy lồng
  const balls = useMemo(() => gachaItems.map((item, i) => ({
    ...item,
    x: Math.random() * 120 - 60,
    y: Math.random() * 20 + 170, // Nằm dưới đáy
    color: ['#FF9A9E', '#FAD0C4', '#A1C4FD', '#C2E9FB', '#FECFEF'][i % 5],
    rotate: Math.random() * 360,
    zIndex: Math.floor(Math.random() * 10)
  })), [items]);

  const handleSpin = () => {
    if (isSpinning || isOpening) return;
    
    setIsSpinning(true); 
    setDroppedBall(null); // Nếu đang có bóng thì thu hồi về máy
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

    setTimeout(() => {
      onComplete(droppedBall);
      setDroppedBall(null);
      setIsOpening(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center py-4 h-full justify-center select-none w-full">
      <div className="relative w-full max-w-md h-[450px] flex flex-col items-center">
        
        {/* 1. Lồng bóng tròn trịa - Nằm phía sau thân máy */}
        <div className="w-64 h-64 bg-white/40 border-8 border-white rounded-full relative overflow-hidden backdrop-blur-md shadow-inner z-0 top-0">
          <AnimatePresence>
            {balls.map((ball, i) => (
              <motion.div
                key={ball.id}
                initial={{ x: ball.x, y: ball.y, rotate: ball.rotate }}
                animate={isSpinning ? { 
                  x: [ball.x, Math.random() * 200 - 100, Math.random() * 200 - 100, ball.x],
                  y: [ball.y, Math.random() * 100 - 50, Math.random() * 100 - 50, ball.y],
                  rotate: [ball.rotate, ball.rotate + 360, ball.rotate - 360, ball.rotate]
                } : { x: ball.x, y: ball.y }}
                transition={{ 
                  duration: 0.5 + Math.random() * 0.3, 
                  repeat: isSpinning ? Infinity : 0, 
                  ease: "easeInOut",
                  delay: i * 0.01 
                }}
                className="absolute w-12 h-12 rounded-full shadow-lg border-2 border-white/40 flex items-center justify-center"
                style={{ backgroundColor: ball.color, left: '40%', zIndex: ball.zIndex }}
              >
                 <div className="w-8 h-8 rounded-full bg-white/20" />
              </motion.div>
            ))} 
          </AnimatePresence>
        </div>
        
        {/* 2. Thân máy hình thang - Nằm phía trước lồng bóng */}
        <div 
          className="relative w-72 h-48 z-10 -mt-6 flex flex-col items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(to bottom, #f3f4f6, #d1d5db)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
            borderRadius: '20px 20px 40px 40px'
          }}
        >
           {/* Viền đỡ lồng bóng */}
           <div className="absolute top-0 left-[25%] right-[25%] h-3 bg-gray-400/50 rounded-full blur-[1px]" />
           
           <div className="flex items-center justify-between w-full px-12 mt-4">
              {/* Núm vặn bên trái */}
              <div className="flex flex-col items-center gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ rotate: 45 }}
                  animate={!isSpinning && !droppedBall ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: ["0px 0px 0px rgba(255,154,158,0)", "0px 0px 15px rgba(255,154,158,0.5)", "0px 0px 0px rgba(255,154,158,0)"]
                  } : {}}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    rotate: { duration: 0.3, ease: "easeOut" }
                  }}
                  onClick={handleSpin}
                  className="w-16 h-16 bg-white rounded-full shadow-lg cursor-pointer flex items-center justify-center border-4 border-gray-300 z-20"
                >
                  <motion.div 
                    animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5, ease: "linear", repeat: isSpinning ? Infinity : 0 }}
                    className="w-2 h-10 bg-gray-500 rounded-full relative"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-600 rounded-full" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Lỗ bóng ra bên phải */}
              <div className="relative w-20 h-14 bg-black/40 rounded-t-3xl border-t-4 border-gray-500/50 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-black/20 to-transparent" />
              </div>
           </div>
        </div>

        {/* 3. Quả bóng trúng thưởng - Xuất hiện tại lỗ bóng */}
        <AnimatePresence>
          {droppedBall && (
            <motion.div
              initial={{ y: 20, x: 55, opacity: 0, scale: 0.5 }}
              animate={isOpening ? {
                scale: [1, 1.3, 0.7, 2, 0],
                rotate: [0, -15, 15, -15, 0],
                y: 10,
                x: 55,
              } : { 
                y: 70,
                x: 55, 
                opacity: 1, 
                scale: 1,
              }}
              exit={{ scale: 3, opacity: 0 }}
              onClick={handleOpenBall}
              className={`absolute bottom-28 z-30 cursor-pointer w-16 h-16 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-3xl
                ${isOpening ? '' : 'hover:scale-110 active:scale-90 transition-transform'}
              `}
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, #ffd700, #ff8c00)',
              }}
            >
              {!isOpening && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-[-10px] rounded-full bg-yellow-400/40 blur-lg -z-10"
                />
              )}
              {isOpening ? "✨" : "🎁"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Chỉ dẫn văn bản (Trung lập) */}
      <div className="text-center">
        <p className="text-xs font-bold text-gray-400 animate-pulse">
          {droppedBall 
            ? (isOpening ? "Đang mở quà..." : "Chạm vào quả bóng để xem kết quả") 
            : "Vặn núm để quay máy Gacha"}
        </p>
      </div>
    </div>
  );
};