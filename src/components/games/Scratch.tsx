import { useState, useEffect, useRef } from 'react';
import type { FoodItem } from '../../types';

export const Scratch = ({ items, onComplete }: { items: FoodItem[], onComplete: (v: FoodItem) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fired = useRef(false);
  const isThresholdMet = useRef(false); // Biến để đánh dấu khi nào cào đủ
  const [winner] = useState(() => items[Math.floor(Math.random() * items.length)]);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Phủ lớp bạc
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#E0E0E0');
    gradient.addColorStop(1, '#A0A0A0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";

    let isDrawing = false;

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Kiểm tra xem đã cào đủ chưa nhưng CHƯA hiện kết quả ngay
      checkProgress(ctx, canvas);
    };

    const checkProgress = (context: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
        const imageData = context.getImageData(0, 0, cvs.width, cvs.height);
        let transparent = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i+3] < 128) transparent++;
        }
        const percent = (transparent / (imageData.data.length / 4)) * 100;
        if (percent > 40) isThresholdMet.current = true;
    };

    const startDraw = () => { isDrawing = true; };
    const endDraw = () => { 
        isDrawing = false; 
        // Khi người dùng buông tay, nếu đã cào đủ thì mới hiện!
        if (isThresholdMet.current && !isRevealed) {
            revealFinal();
        }
    };

    const revealFinal = () => {
        setIsRevealed(true);
        if (canvas) canvas.style.opacity = '0';
        if (!fired.current) {
            onComplete(winner);
            fired.current = true;
        }
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', endDraw); // Lắng nghe cả window cho chắc nha anh
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', endDraw);

    return () => {
        canvas.removeEventListener('mousedown', startDraw);
        canvas.removeEventListener('mousemove', scratch);
        window.removeEventListener('mouseup', endDraw);
    };
  }, [winner, isRevealed, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative w-full max-w-[450px] aspect-[16/9] rounded-[30px] overflow-hidden shadow-2xl border-[6px] border-white bg-white">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-pink-50 to-white">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">Món ăn may mắn:</span>
            <h3 className="text-3xl font-black text-[#FF9A9E] mb-1">{winner.name}</h3>
            {winner.address && <p className="text-xs text-gray-400 font-medium">📍 {winner.address}</p>}
        </div>
        <canvas ref={canvasRef} width={450} height={256} className="absolute inset-0 z-10 cursor-crosshair transition-opacity duration-700" />
      </div>
      <p className="mt-4 text-xs font-bold text-gray-400 animate-pulse">Cào để xem kết quả! ❤️</p>
    </div>
  );
};