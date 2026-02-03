import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../../types';
import { RotateCcw } from 'lucide-react';

const ANIMALS = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🐴', '🦄'];

export const Racing = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [positions, setPositions] = useState<number[]>([]);
  const [isRacing, setIsRacing] = useState(false);
  const [raceDuration, setRaceDuration] = useState(5000); // Mặc định 5s
  const raceItems = items.slice(0, 20);
  
  const startTime = useRef<number>(0);
  const finishTimes = useRef<number[]>([]);
  const speedProfiles = useRef<{ phases: number[] }[]>([]);
  const frameRef = useRef<number>(0);

  // Cấu hình tọa độ mới theo ý anh
  const START_LINE = 5;
  const FINISH_LINE = 90; // Thu hẹp sân đích lại
  const STOP_POS = 94; // Điểm dừng cuối cùng (sát mép phải hơn)

  const initRace = () => {
    if (isRacing) return;

    // Tạo thời gian về đích ngẫu nhiên dựa trên lựa chọn
    const baseTime = raceDuration;
    finishTimes.current = raceItems.map(() => 
      baseTime * (0.9 + Math.random() * 0.4) // Lệch khoảng 10-40% so với mốc chọn
    );

    // Tạo "Speed Profile" để tốc độ biến thiên
    speedProfiles.current = raceItems.map(() => ({
      phases: Array.from({ length: 5 }, () => Math.random() * 0.5 + 0.5) // Các hệ số nhân tốc độ
    }));

    startTime.current = Date.now();
    setIsRacing(true);
    animate();
  };

  const resetRace = () => {
    cancelAnimationFrame(frameRef.current);
    setIsRacing(false);
    setPositions(new Array(raceItems.length).fill(START_LINE));
  };

  const animate = () => {
    const elapsed = Date.now() - startTime.current;
    let allFinished = true;

    const nextPositions = finishTimes.current.map((fTime, i) => {
      const ratio = elapsed / fTime;
      i +=0;
      // Tính toán vị trí dựa trên tiến độ biến thiên
      // f(x) = x + sin(x) để vận tốc thay đổi nhưng luôn tiến về trước
      const smoothRatio = ratio + (Math.sin(ratio * Math.PI * 3) * 0.05);
      const currentPos = START_LINE + (FINISH_LINE - START_LINE) * Math.min(smoothRatio, 1);
      
      // Dừng thép tại điểm STOP_POS
      const finalPos = ratio >= 1 ? STOP_POS : Math.max(START_LINE, currentPos);
      
      if (finalPos < STOP_POS) allFinished = false;
      return finalPos;
    });

    setPositions(nextPositions);

    if (allFinished) {
      setIsRacing(false);
      const winnerIdx = finishTimes.current.indexOf(Math.min(...finishTimes.current));
      setTimeout(() => onComplete(raceItems[winnerIdx]), 800);
      return;
    }

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Khởi tạo vị trí vạch xuất phát
    setPositions(new Array(raceItems.length).fill(START_LINE));
    return () => cancelAnimationFrame(frameRef.current);
  }, [items]);

  return (
    <div className="w-full h-full flex flex-col p-2 select-none">
      
      {/* Header điều khiển */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-gray-400 tracking-widest">THỜI GIAN ĐUA</label>
          <select 
            disabled={isRacing}
            value={raceDuration}
            onChange={(e) => setRaceDuration(Number(e.target.value))}
            className="bg-white/80 backdrop-blur-md border-none rounded-xl px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm outline-none cursor-pointer hover:bg-white transition-all"
          >
            <option value={1000}>1 giây (Siêu tốc)</option>
            <option value={5000}>5 giây (Vừa đủ)</option>
            <option value={10000}>10 giây (Hồi hộp)</option>
            <option value={15000}>15 giây (Gay cấn)</option>
            <option value={30000}>30 giây (Vô tận)</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isRacing ? (
              <motion.div 
                key="flag"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={initRace}
                className="group flex flex-col items-center cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform"
                >
                  🚩
                </motion.div>
                <span className="text-[10px] font-black text-pink-400 mt-1 animate-pulse">PHẤT CỜ ĐỂ ĐUA</span>
              </motion.div>
            ) : (
              <motion.button
                key="reset"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={resetRace}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-white rounded-full text-[10px] font-bold text-gray-500 shadow-sm transition-all"
              >
                <RotateCcw size={12} /> ĐUA LẠI TỪ ĐẦU
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sân đua */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {raceItems.map((item, i) => (
          <div 
            key={item.id} 
            className="relative h-12 w-full bg-white/40 rounded-xl flex items-center px-4 border border-white/50 shadow-sm overflow-hidden"
          >
            {/* Vạch xuất phát (Start) */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gray-200" 
              style={{ left: `${START_LINE}%` }}
            />

            {/* Tên món & Địa chỉ */}
            <div 
              className="absolute font-sans leading-tight text-right pr-4"
              style={{ left: '10%', right: `${100 - FINISH_LINE + 2}%` }}
            >
               <p className="text-[11px] font-black text-gray-700 truncate">{item.name}</p>
               <p className="text-[9px] text-gray-400 truncate italic">{item.address}</p>
            </div>
            
            {/* Vạch đích (Finish) */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-[repeating-linear-gradient(45deg,#ff4d4d,#ff4d4d_4px,#fff_4px,#fff_8px)] opacity-40 shadow-sm" 
              style={{ left: `${FINISH_LINE}%` }}
            />

            {/* Thú đua */}
            <motion.div 
              className="absolute text-2xl z-10 select-none drop-shadow-md flex items-center justify-center w-8 h-8"
              style={{ 
                  left: `${positions[i] || START_LINE}%`,
                  marginLeft: '-16px' 
              }}
              // Chỉ rung lắc khi đang đua và chưa tới vạch đích
              animate={isRacing && (positions[i] || 0) < FINISH_LINE ? { 
                y: [0, -4, 0],
                rotate: [-5, 5, -5] 
              } : { y: 0, rotate: 0 }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              {ANIMALS[i % ANIMALS.length]}
            </motion.div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-center text-gray-400 italic">
        {isRacing ? "Cuộc đua đang diễn ra vô cùng kịch tính! 🏁" : "Chọn thời gian và phất cờ để bắt đầu cuộc đua nha! ❤️"}
      </p>
    </div>
  );
};