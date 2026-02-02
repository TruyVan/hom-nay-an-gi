import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { FoodItem } from '../../types';
import { Button } from '../Button';

const ANIMALS = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🐴', '🦄'];

export const Racing = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [positions, setPositions] = useState<number[]>([]);
  const [isRacing, setIsRacing] = useState(false);
  const raceItems = items.slice(0, 20);
  
  const startTime = useRef<number>(0);
  const finishTimes = useRef<number[]>([]);
  const frameRef = useRef<number>(0);

  // Cấu hình tọa độ "vàng"
  const FINISH_LINE_PERCENT = 80; // Vạch đích nằm ở 80%
  const STOP_OFFSET = 8; // Dừng lại sau vạch đích 8%
  const MAX_POS = FINISH_LINE_PERCENT + STOP_OFFSET; // Tổng cộng 88%

  const initRace = () => {
    // Thời gian đua kịch tính quanh mốc 5s
    const winnerTime = 4800 + Math.random() * 500; 
    // Các con khác chậm hơn tối đa 2.5s
    const times = raceItems.map(() => winnerTime + Math.random() * 2500).sort(() => Math.random() - 0.5);
    
    finishTimes.current = times;
    startTime.current = Date.now();
    setIsRacing(true);
    animate();
  };

  const animate = () => {
    const elapsed = Date.now() - startTime.current;
    let allFinished = true;

    const nextPositions = finishTimes.current.map((fTime) => {
      // Tính toán progress: 100% của progress tương ứng với FINISH_LINE_PERCENT
      const progressRatio = elapsed / fTime;
      const currentPos = progressRatio * FINISH_LINE_PERCENT;
      
      // LOGIC DỪNG THÉP: 
      // Khi đã vượt vạch đích (FINISH_LINE_PERCENT), 
      // cho phép đi thêm một chút (STOP_OFFSET) rồi đứng im re.
      const cappedPos = Math.min(currentPos, MAX_POS);
      
      if (cappedPos < MAX_POS) allFinished = false;
      return cappedPos;
    });

    setPositions(nextPositions);

    // Nếu tất cả đã "phanh" đứng im sau vạch đích
    if (allFinished) {
      setIsRacing(false);
      const winnerIdx = finishTimes.current.indexOf(Math.min(...finishTimes.current));
      // Đợi 1s để anh nhìn rõ mặt "kẻ thắng cuộc"
      setTimeout(() => onComplete(raceItems[winnerIdx]), 1000);
      return;
    }

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
        {raceItems.map((item, i) => (
          <div 
            key={item.id} 
            className="relative h-16 w-full bg-white/60 rounded-2xl flex items-center border border-white shadow-sm overflow-hidden"
            style={{ paddingRight: '12%' }} // Tạo khoảng trống an toàn bên phải
          >
            {/* Tên món: Căn lề phải, nằm bên trái vạch đích */}
            <div 
              className="absolute font-sans leading-tight text-right"
              style={{ left: '10%', right: `${100 - FINISH_LINE_PERCENT + 2}%` }}
            >
               <p className="text-xs font-black text-gray-700 truncate">{item.name}</p>
               <p className="text-[10px] text-gray-400 truncate italic">{item.address}</p>
            </div>
            
            {/* Vạch đích: Cố định chuẩn xác */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-[repeating-linear-gradient(45deg,#ff4d4d,#ff4d4d_5px,#fff_5px,#fff_10px)] opacity-40 shadow-sm" 
              style={{ left: `${FINISH_LINE_PERCENT}%` }}
            />

            {/* Thú đua: Icon 32px, căn giữa bằng margin-left âm */}
            <motion.div 
              className="absolute text-3xl z-10 select-none drop-shadow-md flex items-center justify-center w-10 h-10"
              style={{ 
                  left: `${positions[i] || 0}%`,
                  marginLeft: '-20px' // Center icon trên trục left
              }}
              animate={isRacing && (positions[i] || 0) < MAX_POS ? { 
                y: [0, -3, 0],
                rotate: [-2, 2, -2] 
              } : { y: 0, rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.2 }}
            >
              {ANIMALS[i % ANIMALS.length]}
            </motion.div>
          </div>
        ))}
      </div>
      
      {!isRacing && (
        <div className="mt-6 flex justify-center">
            <Button 
              onClick={initRace} 
              className="px-12 py-4 text-lg shadow-[0_10px_20px_rgba(255,154,158,0.3)] hover:shadow-[0_15px_30px_rgba(255,154,158,0.5)] transition-all"
            >
              Thả thú đua ngay! 🏇
            </Button>
        </div>
      )}
    </div>
  );
};