import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FoodItem } from '../../types';

export const Wheel = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(3500); // Thời gian quay biến thiên
  const colors = ['#FF9A9E', '#FAD0C4', '#A1C4FD', '#C2E9FB', '#FECFEF', '#D4FC79'];

  const handleSpin = () => {
    if (isSpinning) return;
    
    // Ngẫu nhiên hóa tốc độ và quãng đường
    const randomDuration = 3000 + Math.random() * 3000; // Quay từ 3s đến 6s
    const extraRounds = 5 + Math.floor(Math.random() * 5); // Quay từ 5 đến 10 vòng
    const extraDegrees = (extraRounds * 360) + Math.random() * 360;
    
    const newRotation = rotation + extraDegrees;
    
    setSpinDuration(randomDuration);
    setRotation(newRotation);
    setIsSpinning(true);

    // 1. Chờ vòng quay dừng dựa trên thời gian ngẫu nhiên
    setTimeout(() => {
      setIsSpinning(false);
      
      const actualRotation = newRotation % 360;
      const segmentAngle = 360 / items.length;
      
      // Logic tính toán index chính xác cho kim chỉ ở hướng 12h
      const winningIndex = Math.floor(((360 - actualRotation) % 360) / segmentAngle);
      const result = items[winningIndex % items.length];

      // 2. Chờ 1.5s để người dùng tận hưởng kết quả trước khi báo cáo
      setTimeout(() => {
        onComplete(result);
      }, 1500); 

    }, randomDuration);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 select-none">
      {/* Container tương tác: Bấm vào đây hoặc kim đều quay */}
      <div 
        className="relative cursor-pointer group"
        onClick={handleSpin}
      >
        {/* Kim chỉ ở đỉnh (12 giờ) - Có hiệu ứng nhấp nháy thu hút */}
        <motion.div 
          animate={!isSpinning ? { y: [0, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute top-[-22px] left-1/2 -translate-x-1/2 z-40 transition-transform group-hover:scale-110"
        >
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-[#FF6B6B] drop-shadow-md" />
            <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#FF6B6B]" />
        </motion.div>

        {/* Vòng quay chính */}
        <div 
          className="w-80 h-80 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-full border-8 border-white bg-white relative overflow-hidden transition-transform"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            // Tốc độ quay biến thiên theo state
            transition: isSpinning ? `transform ${spinDuration}ms cubic-bezier(0.15, 0, 0.15, 1)` : 'none',
            background: `conic-gradient(${items.map((_, i) => 
                `${colors[i % colors.length]} ${i * (100/items.length)}% ${(i+1) * (100/items.length)}%`
            ).join(', ')})`
          }}
        >
            {items.map((item, i) => {
                const segmentAngle = 360 / items.length;
                const rotateAngle = segmentAngle * i + segmentAngle / 2;
                
                return (
                    <div 
                      key={item.id}
                      className="absolute top-1/2 left-1/2 w-1/2 h-0 origin-left flex items-center justify-end"
                      style={{ 
                        transform: `rotate(${rotateAngle - 90}deg)` 
                      }}
                    >
                      <span 
                        className="text-[10px] font-black text-gray-700 whitespace-nowrap pr-6"
                        style={{ 
                          textAlign: 'right',
                          maxWidth: '100px'
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                );
            })}
        </div>
        
        {/* Tâm vòng quay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg z-20 flex items-center justify-center border-4 border-gray-50 group-hover:scale-105 transition-transform">
            <div className="w-2 h-2 bg-pink-300 rounded-full animate-ping" />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <p className="text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">
          {isSpinning ? "Đang tìm món ngon cho bạn..." : "Chạm vào vòng quay để bắt đầu! ❤️"}
        </p>
      </div>
    </div>
  );
};