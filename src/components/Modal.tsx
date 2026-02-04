import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { FoodItem } from '../types';
import { INITIAL_FOODS } from '../constants';
import { Button } from './Button';
import { Trash2, X, RotateCcw, AlertTriangle, Pencil, Check } from 'lucide-react'; // Thêm icon Pencil và Check
import { formatDate } from '../utils';

export const Modal = ({ onClose, foods, setFoods, history, setHistory, excludeEaten, setExcludeEaten }: any) => {
  const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // States cho xác nhận và chỉnh sửa
  const [showConfirmClearHistory, setShowConfirmClearHistory] = useState(false);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  
  // State mới cho chức năng Sửa
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    if (excludeEaten) {
      setFoods((prev: FoodItem[]) => prev.map(f => history.some((h: any) => h.foodName === f.name) ? { ...f, active: false } : f));
    } else {
      setFoods((prev: FoodItem[]) => prev.map(f => ({ ...f, active: true })));
    }
  }, [excludeEaten, history.length]);

  const addFood = () => {
    if (!name.trim() && !address.trim()) {
      toast.error("Vui lòng điền Tên món/Địa chỉ! 🥺", { position: "top-center" });
      return;
    }
    if (foods.length >= 20) {
      toast.error("Giới hạn tối đa là 20 món. 🤚");
      return;
    }
    setFoods([...foods, { id: crypto.randomUUID(), name: name || 'Món bí ẩn', address, active: true }]);
    setName(''); setAddress('');
    toast.success("Đã thêm món mới thành công! 🥰");
  };

  // Logic Sửa món
  const startEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setEditName(food.name);
    setEditAddress(food.address || '');
  };

  const saveEdit = (id: string) => {
    if (!editName.trim() && !editAddress.trim()) {
      toast.error("Không được để trống cả tên và địa chỉ nha! 😿");
      return;
    }
    setFoods(foods.map((f: any) => f.id === id ? { ...f, name: editName, address: editAddress } : f));
    setEditingId(null);
    toast.success("Đã cập nhật thông tin món ăn! ✨");
  };

  const restoreDefault = () => {
    setFoods(INITIAL_FOODS);
    toast.success("Đã khôi phục thực đơn mặc định! 🍱");
  };

  const deleteAllFoods = () => {
    setFoods([]);
    setShowConfirmDeleteAll(false);
    toast.warn("Đã xóa sạch toàn bộ danh sách món ăn! 🗑️");
  };

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fdfbf7] w-full max-w-2xl h-[85vh] rounded-[45px] shadow-[0_30px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-white cursor-default"
      >
        {/* Header Tab */}
        <div className="p-6 bg-white flex justify-between items-center border-b border-gray-100">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-3xl">
            <button onClick={() => setActiveTab('list')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white shadow-md text-[#FF9A9E]' : 'text-gray-400 hover:text-gray-600'}`}>Danh sách món</button>
            <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-md text-[#A1C4FD]' : 'text-gray-400 hover:text-gray-600'}`}>Nhật ký ăn uống</button>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'list' ? (
            <div className="space-y-8">
              {/* Filter Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#FF9A9E]/10 to-[#FAD0C4]/10 rounded-[30px] border border-white shadow-inner">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-700 text-lg">Lọc món đã ăn</p>
                    <p className="text-xs text-gray-400 italic">Tự động loại bỏ các món đã ăn ra khỏi vòng quay!</p>
                  </div>
                  <div onClick={() => setExcludeEaten(!excludeEaten)} className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 relative ${excludeEaten ? 'bg-[#FF9A9E] shadow-[0_0_15px_rgba(255,154,158,0.5)]' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${excludeEaten ? 'translate-x-8' : ''}`} />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button onClick={restoreDefault} className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <RotateCcw size={14} /> Khôi phục mặc định
                  </button>
                  
                  {!showConfirmDeleteAll ? (
                    <button onClick={() => setShowConfirmDeleteAll(true)} className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 size={14} /> Xóa toàn bộ
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-500 p-1.5 rounded-xl animate-pop-in">
                      <span className="text-[9px] text-white font-bold px-2">Xác nhận xóa hết?</span>
                      <button onClick={deleteAllFoods} className="bg-white text-red-500 px-3 py-1 rounded-lg text-[9px] font-black">CÓ</button>
                      <button onClick={() => setShowConfirmDeleteAll(false)} className="text-white px-3 py-1 text-[9px] font-bold underline">Hủy</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-3 bg-white p-6 rounded-[35px] shadow-sm border border-gray-100">
                <p className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Thêm món ngon mới</p>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên món ăn..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#FF9A9E] transition-all outline-none text-sm" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ quán..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#A1C4FD] transition-all outline-none text-sm" />
                <Button onClick={addFood} className="w-full py-4 mt-2">Thêm vào thực đơn</Button>
              </div>

              {/* Food List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">Danh sách hiện tại ({foods.length})</p>
                    <p className="text-[9px] text-gray-400 italic">* Tích chọn để đưa món vào vòng quay random</p>
                </div>
                
                {foods.length === 0 && <p className="text-center py-10 text-gray-300 italic text-sm">Danh sách trống trơn mất tiêu rồii! 🥣</p>}
                
                {foods.map((food: any) => (
                  <div key={food.id} className={`flex items-center justify-between p-5 rounded-[25px] transition-all border ${food.active ? 'bg-white shadow-sm border-white' : 'bg-gray-50 opacity-60 border-transparent'}`}>
                    
                    {/* View Mode vs Edit Mode */}
                    {editingId === food.id ? (
                      <div className="flex flex-col gap-2 flex-1 mr-4 animate-fade-in">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-pink-200 text-sm focus:outline-none" placeholder="Tên món..." />
                        <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-blue-200 text-xs focus:outline-none" placeholder="Địa chỉ..." />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 flex-1">
                        <input type="checkbox" checked={food.active} onChange={() => setFoods(foods.map((f: any) => f.id === food.id ? { ...f, active: !f.active } : f))} className="w-6 h-6 accent-[#FF9A9E] cursor-pointer" />
                        <div className="truncate">
                          <p className={`font-bold ${!food.active ? 'line-through text-gray-400' : 'text-gray-700'}`}>{food.name}</p>
                          {food.address && <p className="text-xs text-gray-400 truncate max-w-[200px]">{food.address}</p>}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {editingId === food.id ? (
                        <button onClick={() => saveEdit(food.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"><Check size={20} /></button>
                      ) : (
                        <button onClick={() => startEdit(food)} className="p-2 text-gray-300 hover:text-blue-400 transition-colors"><Pencil size={18} /></button>
                      )}

                      <div className="flex items-center">
                        {itemToDeleteId === food.id ? (
                          <div className="flex items-center gap-2 animate-pop-in bg-gray-100 p-1 rounded-xl">
                            <button onClick={() => { setFoods(foods.filter((f: any) => f.id !== food.id)); setItemToDeleteId(null); }} className="bg-red-400 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm">Xóa</button>
                            <button onClick={() => setItemToDeleteId(null)} className="text-gray-400 px-2 text-[10px] font-bold">Hủy</button>
                          </div>
                        ) : (
                          <button onClick={() => setItemToDeleteId(food.id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* History Section */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold text-gray-400 italic"></p>
                {!showConfirmClearHistory ? (
                  <button onClick={() => setShowConfirmClearHistory(true)} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"><Trash2 size={14} /> Xóa nhật ký</button>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-2xl animate-pulse border border-red-100">
                    <span className="text-[10px] font-bold text-red-500">Xóa vĩnh viễn? 🥺</span>
                    <button onClick={() => { setHistory([]); setShowConfirmClearHistory(false); toast.info("Đã làm mới nhật ký! ✨"); }} className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold">Xóa!</button>
                    <button onClick={() => setShowConfirmClearHistory(false)} className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold">Giữ lại</button>
                  </div>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-20"><AlertTriangle size={48} /><p className="font-bold mt-4">Chưa có món nào được ghi lại!</p></div>
              ) : (
                history.map((h: any) => (
                  <div key={h.id} className="p-6 bg-white rounded-[30px] shadow-sm border-l-8 border-[#A1C4FD] hover:translate-x-2 transition-transform border border-gray-50">
                    <div className="flex justify-between items-start">
                      <div><p className="font-black text-gray-700 text-lg">{h.foodName}</p><p className="text-xs text-gray-400 mt-1">📍 {h.address || 'Không rõ địa chỉ'}</p></div>
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