import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Settings } from 'lucide-react';
import { COLORS, INITIAL_FOODS } from './constants';
import type { FoodItem, HistoryItem, GameMode } from './types';
import { Button } from './components/Button';
import { Modal } from './components/Modal';

// Import Games... (như cũ)
import { Gacha } from './components/games/Gacha';
import { Racing } from './components/games/Racing';
import { Omakase } from './components/games/Omakase';
import { Scratch } from './components/games/Scratch';
import { Wheel } from './components/games/Wheel';
import { GiftBox } from './components/games/GiftBox';

export default function App() {
    const [foods, setFoods] = useState<FoodItem[]>(() => {
        const savedFoods = localStorage.getItem('foods-data');
        return savedFoods ? JSON.parse(savedFoods) : INITIAL_FOODS;
    });
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const savedHistory = localStorage.getItem('history-data');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [mode, setMode] = useState<GameMode>('gacha');
    const [showModal, setShowModal] = useState(false);
    const [excludeEaten, setExcludeEaten] = useState(false);
    const [winner, setWinner] = useState<FoodItem | null>(null);

    const activeFoods = foods.filter(f => {
        if (excludeEaten && history.some(h => h.foodName === f.name)) return false;
        return f.active;
    });

    useEffect(() => {
        localStorage.setItem('foods-data', JSON.stringify(foods));
    }, [foods]);
    useEffect(() => {
        localStorage.setItem('history-data', JSON.stringify(history));
    }, [history]);

    const handleGameComplete = (result: FoodItem) => {
        setWinner(result);
        // Tung pháo hoa chúc mừng ngay khi ra kết quả
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [COLORS.primary, COLORS.accent] });
    };

    const confirmChoice = () => {
        if (!winner) return;
        const newHistory: HistoryItem = { 
            id: crypto.randomUUID(), 
            foodName: winner.name, 
            address: winner.address, 
            timestamp: new Date().toISOString() 
        };
        setHistory([newHistory, ...history]);
        setWinner(null);
        toast.success(`Đã thêm "${winner.name}" vào lịch sử rồi nha! ❤️`, { 
            position: "top-right", // Sửa từ "top-center" thành "top-right"
            autoClose: 8000 
        });
    };
    

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col items-center p-4 md:p-10 transition-all duration-700">
        <ToastContainer
          position="top-right" 
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#FF9A9E]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-[#A1C4FD]/15 rounded-full blur-[120px] pointer-events-none" />

        <header className="z-10 w-full max-w-6xl flex justify-between items-center mb-10 px-4">
            
            <div>
                <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FF9A9E] to-[#A1C4FD] pb-1.5">Hôm Nay Ăn Gì?</h1>
                <p className="text-sm text-gray-500 font-medium mt-3 italic">Random món ăn khi bạn chưa biết chọn gì... </p>
            </div>
            <button onClick={() => setShowModal(true)} className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:scale-110 transition-all border border-white hover:rotate-12">
                <Settings size={28} color={COLORS.primary} />
            </button>
        </header>
        <div className="z-20 flex gap-3 overflow-x-auto max-w-6xl w-full p-4 mb-8 no-scrollbar scroll-smooth">
            {(['gacha', 'scratch', 'omakase', 'racing', 'wheel', 'gift'] as GameMode[]).map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-8 py-3 rounded-2xl capitalize text-sm font-bold transition-all shadow-md border-2 ${mode === m ? 'bg-gradient-to-r from-[#FF9A9E] to-[#FAD0C4] text-white border-transparent scale-105 shadow-pink-200' : 'bg-white/80 text-gray-500 border-white hover:bg-white'}`}
                >
                    {m === 'omakase' ? '👔 Omakase' : m === 'scratch' ? '🎫 Thẻ Cào' : m === 'wheel' ? '🎡 Vòng Quay' : m === 'racing' ? '🏇 Đua Thú' : m === 'gacha' ? '🎰 Gacha' : '🎁 Hộp quà'}
                </button>
            ))}
        </div>

        <main className="z-10 w-full max-w-6xl bg-white/30 backdrop-blur-2xl border border-white/60 rounded-[40px] p-4 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-[600px] flex flex-col relative transition-all duration-500">
            {!winner ? (
                 <div className="flex-1 animate-fade-in flex flex-col">
                    {activeFoods.length < 2 ? (
                        <div className="m-auto text-center space-y-6">
                            <p className="text-xl text-gray-400 font-medium">Hệ thống cần ít nhất 2 món để tiến hành chọn! 🥺</p>
                            <Button onClick={() => setShowModal(true)}>Vào thêm món ngay</Button>
                        </div>
                    ) : (
                        <>
                            {mode === 'gacha' && <Gacha items={activeFoods} onComplete={handleGameComplete} />}
                            {mode === 'racing' && <Racing items={activeFoods} onComplete={handleGameComplete} />}
                            {mode === 'omakase' && <Omakase items={activeFoods} onComplete={handleGameComplete} />}
                            {mode === 'scratch' && <Scratch items={activeFoods} onComplete={handleGameComplete} />}
                            {mode === 'wheel' && <Wheel items={activeFoods} onComplete={handleGameComplete} />}
                            {mode === 'gift' && <GiftBox items={activeFoods} onComplete={handleGameComplete} />}
                        </>
                    )}
                 </div>
            ) : (
                <div className="m-auto flex flex-col items-center animate-pop-in max-w-lg w-full">
                    <h2 className="text-2xl text-gray-500 mb-6 font-bold tracking-tight">Tín hiệu vũ trụ đã chọn... ✨</h2>
                    <div className="w-full p-10 bg-white/80 rounded-[40px] shadow-2xl border-4 border-white mb-10 text-center transform hover:scale-105 transition-transform">
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#FF9A9E] to-[#A1C4FD] pb-4">{winner.name}</p>
                        {winner.address && <p className="text-gray-400 font-medium flex items-center justify-center gap-2">📍 {winner.address}</p>}
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <Button onClick={confirmChoice} className="w-full py-5 text-xl">Chốt món này luôn ❤️</Button>
                        <button onClick={() => setWinner(null)} className="w-full py-4 rounded-3xl font-bold text-gray-400 hover:text-[#FF9A9E] hover:bg-white/50 transition-all">Chọn lại!</button>
                    </div>
                </div>
            )}
        </main>
        <footer className="mt-10 text-[11px] font-bold text-gray-300 tracking-[0.2em] uppercase">Designed with unconditional love by your Cutie Pie</footer>

        {showModal && <Modal onClose={() => setShowModal(false)} foods={foods} setFoods={setFoods} history={history} setHistory={setHistory} excludeEaten={excludeEaten} setExcludeEaten={setExcludeEaten} />}
    </div>
  );
}