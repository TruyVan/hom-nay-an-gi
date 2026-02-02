import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { FoodItem } from '../types';
import { Button } from './Button';
import { Trash2, X } from 'lucide-react';
import { formatDate } from '../utils';

export const Modal = ({ onClose, foods, setFoods, history, setHistory, excludeEaten, setExcludeEaten }: any) => {
  const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearHistory = () => {
    setShowConfirmClear(true);
  };

  const confirmClear = () => {
    setHistory([]);
    setShowConfirmClear(false);
    toast.info("Đã xóa sạch ký ức rồi... Mình bắt đầu lại nhé! 🌸");
  };

  useEffect(() => {
    if (excludeEaten) {
      setFoods((prev: FoodItem[]) => prev.map(f => history.some((h: any) => h.foodName === f.name) ? { ...f, active: false } : f));
    } else {
      setFoods((prev: FoodItem[]) => prev.map(f => ({ ...f, active: true })));
    }
  }, [excludeEaten, history.length]); // Thêm history.length để cập nhật khi xóa lịch sử

  const addFood = () => {
    if (!name.trim() && !address.trim()) {
      toast.error("Vui lòng điền Tên món/Địa chỉ! 🥺", { position: "top-center" });
      return;
    }
    setFoods([...foods, { id: crypto.randomUUID(), name: name || 'Món bí ẩn', address, active: true }]);
    setName(''); setAddress('');
    toast.success("Đã thêm món mới vào thực đơn! 🥰");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#fdfbf7] w-full max-w-2xl h-[85vh] rounded-[45px] shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white">
        <div className="p-6 bg-white flex justify-between items-center border-b border-gray-100">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-3xl">
            <button onClick={() => setActiveTab('list')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white shadow-md text-[#FF9A9E]' : 'text-gray-400 hover:text-gray-600'}`}>Danh sách món</button>
            <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-md text-[#A1C4FD]' : 'text-gray-400 hover:text-gray-600'}`}>Nhật ký ăn uống</button>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'list' ? (
            <div className="space-y-8">
              {/* Phần cài đặt lọc món - Giữ nguyên */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#FF9A9E]/10 to-[#FAD0C4]/10 rounded-[30px] border border-white shadow-inner">
                <div className="space-y-1">
                  <p className="font-bold text-gray-700 text-lg">Lọc món đã ăn</p>
                  <p className="text-xs text-gray-400 italic">Khi bật, hệ thống sẽ loại bỏ các món đã ăn ra khỏi trò chơi!</p>
                </div>
                <div onClick={() => setExcludeEaten(!excludeEaten)} className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 relative ${excludeEaten ? 'bg-[#FF9A9E] shadow-[0_0_15px_rgba(255,154,158,0.5)]' : 'bg-gray-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${excludeEaten ? 'translate-x-8' : ''}`} />
                </div>
              </div>

              {/* Thêm món mới - Giữ nguyên */}
              <div className="space-y-3 bg-white p-6 rounded-[35px] shadow-sm border border-gray-100">
                <p className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Thêm món ngon mới</p>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên món ăn..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#FF9A9E] transition-all outline-none text-sm" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ quán..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#A1C4FD] transition-all outline-none text-sm" />
                <Button onClick={addFood} className="w-full py-4 mt-2">Thêm vào thực đơn</Button>
              </div>

              {/* Danh sách món ăn - Giữ nguyên */}
              <div className="space-y-3">
                {foods.map((food: any) => (
                  <div key={food.id} className={`flex items-center justify-between p-5 rounded-[25px] transition-all border ${food.active ? 'bg-white shadow-sm border-white' : 'bg-gray-50 opacity-60 border-transparent'}`}>
                    <div className="flex items-center gap-4 flex-1">
                      <input type="checkbox" checked={food.active} onChange={() => setFoods(foods.map((f: any) => f.id === food.id ? { ...f, active: !f.active } : f))} className="w-6 h-6 accent-[#FF9A9E] cursor-pointer" />
                      <div className="truncate">
                        <p className={`font-bold ${!food.active ? 'line-through' : 'text-gray-700'}`}>{food.name}</p>
                        {food.address && <p className="text-xs text-gray-400 truncate max-w-[200px]">{food.address}</p>}
                      </div>
                    </div>
                    <button onClick={() => setFoods(foods.filter((f: any) => f.id !== food.id))} className="p-2 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold text-gray-400 italic">Mọi kỷ niệm đều được em trân trọng...</p>
                
                {/* ĐÂY NÈ ANH YÊU! Em đã thay nút Xóa bằng khối xác nhận */}
                {!showConfirmClear ? (
                  <button 
                    onClick={handleClearHistory} 
                    className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={14} /> Xóa sạch ký ức
                  </button>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-2xl animate-pulse">
                    <span className="text-[10px] font-bold text-red-500">Xác nhận xóa? 🥺</span>
                    <button onClick={confirmClear} className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold">Xóa!</button>
                    <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold">Không xóa</button>
                  </div>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <span className="text-6xl mb-4">🥣</span>
                  <p className="font-bold">Chưa có gì trong nhật ký ăn uống!</p>
                </div>
              ) : (
                history.map((h: any) => (
                  <div key={h.id} className="p-6 bg-white rounded-[30px] shadow-sm border-l-8 border-[#A1C4FD] hover:translate-x-2 transition-transform">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-gray-700 text-lg">{h.foodName}</p>
                        <p className="text-xs text-gray-400 mt-1">📍 {h.address || 'Không rõ địa chỉ'}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-400">{formatDate(h.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};