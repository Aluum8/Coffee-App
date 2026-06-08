import React, { useState } from 'react';
import { useCart } from '../pages/cart';

export default function Foodcard({ food }) {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    addToCart(food, quantity, note);
    setShowModal(false);
    setQuantity(1);
    setNote("");
  };

  return (
    <>
      <div className="group bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <img 
            src={food.image || "https://placehold.co/600x400?text=No+Image"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={food.name}
          />
          {!food.available && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-800 capitalize leading-tight mb-1">{food.name}</h3>
            <p className="text-orange-600 font-black text-lg">{food.price} dt</p>
          </div>

          <button 
            disabled={!food.available}
            onClick={() => setShowModal(true)}
            className="mt-6 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-orange-500 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-400"
          >
            {food.available ? "Add to Order" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* --- PREMIUM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Animated Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-sm rounded-[45px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl">
                {food.image ? <img src={food.image} className="w-full h-full object-cover rounded-3xl" /> : "☕"}
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-none mb-2">Customize</h2>
              <p className="text-gray-400 font-medium">{food.name}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-[30px] mb-6 border border-gray-100">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 bg-white rounded-2xl shadow-sm text-2xl font-black text-gray-800 hover:bg-orange-500 hover:text-white transition-colors"
              >—</button>
              <span className="text-3xl font-black text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 bg-white rounded-2xl shadow-sm text-2xl font-black text-gray-800 hover:bg-orange-500 hover:text-white transition-colors"
              >+</button>
            </div>

            {/* Note Input */}
            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-4">Special Requests</label>
              <textarea 
                placeholder="Ex: sans sucre, chaud, etc..."
                className="w-full bg-gray-50 p-5 rounded-[25px] outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none border border-gray-100 placeholder:text-gray-300"
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirm}
                className="w-full bg-orange-500 text-white py-5 rounded-[24px] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95"
              >
                Confirm • {(food.price * quantity).toFixed(2)} dt
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-gray-400 font-bold text-sm hover:text-gray-600 transition"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}