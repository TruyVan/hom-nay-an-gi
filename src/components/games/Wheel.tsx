import { useState } from 'react';
import type { FoodItem } from '../../types';
import { Button } from '../Button';

export const Wheel = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const colors = ['#FF9A9E', '#FAD0C4', '#A1C4FD', '#C2E9FB', '#FECFEF', '#D4FC79'];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    const extraDegrees = 1800 + Math.random() * 360;
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    // 1. Chờ vòng quay dừng (3.5s)
    setTimeout(() => {
      setIsSpinning(false);
      
      const actualRotation = newRotation % 360;
      const segmentAngle = 360 / items.length;
      const winningIndex = Math.floor(((360 - actualRotation) % 360) / segmentAngle);
      const result = items[winningIndex];

      // 2. CHỜ THÊM 1.5s để anh ngắm kết quả trước khi hiện Modal chúc mừng
      setTimeout(() => {
        onComplete(result);
      }, 1500); 

    }, 3500);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 select-none">
      <div className="relative w-80 h-80 shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-full border-8 border-white bg-white">
        
        {/* Kim chỉ ở đỉnh (12 giờ) */}
        <div className="absolute top-[-22px] left-1/2 -translate-x-1/2 z-40">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-[#FF6B6B] drop-shadow-md" />
            <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#FF6B6B]" />
        </div>

        {/* Vòng quay chính */}
        <div 
          className="w-full h-full rounded-full transition-transform duration-[3500ms] cubic-bezier(0.15, 0, 0.15, 1) relative overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${items.map((_, i) => 
                `${colors[i % colors.length]} ${i * (100/items.length)}% ${(i+1) * (100/items.length)}%`
            ).join(', ')})`
          }}
        >
            {items.map((item, i) => {
                const segmentAngle = 360 / items.length;
                // Mỗi nhãn dán nằm ở giữa phân đoạn
                const rotateAngle = segmentAngle * i + segmentAngle / 2;
                
                return (
                    <div 
                      key={item.id}
                      className="absolute top-1/2 left-1/2 w-1/2 h-0 origin-left flex items-center justify-end"
                      style={{ 
                        // -90 để đưa index 0 lên đỉnh lúc khởi đầu
                        transform: `rotate(${rotateAngle - 90}deg)` 
                      }}
                    >
                      <span 
                        className="text-[10px] font-black text-gray-700 whitespace-nowrap pr-6"
                        style={{ 
                          // Xoay chữ lại để nó dọc theo bán kính như anh muốn
                          transform: `rotate(0deg)`, 
                          // Đảm bảo chữ bám mép ngoài nhờ justify-end và pr-6
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
        
        {/* Tâm vòng quay cho xịn xò */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg z-20 flex items-center justify-center border-4 border-gray-50">
            <div className="w-2 h-2 bg-pink-300 rounded-full animate-ping" />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <Button 
            onClick={handleSpin} 
            disabled={isSpinning} 
            className="px-12 py-4 text-lg"
        >
          {isSpinning ? 'Đang quay...' : 'Quay ngay nào! ❤️'}
        </Button>
        <p className="text-[10px] text-gray-400 italic">Click để quay!</p>
      </div>
    </div>
  );
};