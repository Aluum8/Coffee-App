import React, { createContext, useContext, useState } from 'react';
import Navbar from '../components/navbar';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity, note) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.note === note
      );
      if (existingIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      }
      return [...prev, { ...product, quantity, note }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 pt-12 pb-32">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Bag</h1>
            <p className="text-gray-400 font-medium">{cart.length} unique items</p>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-500 transition">
              Clear All
            </button>
          )}
        </header>

        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-400 text-xl font-medium mb-8">Hungry? Start adding items!</p>
            <a href="/" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-orange-100">Browse Menu</a>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-6 group">
                <div className="relative flex-shrink-0">
                  <img src={item.image || "https://placehold.co/100"} className="w-24 h-24 rounded-[28px] object-cover bg-gray-50 shadow-sm" alt="" />
                  <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full border-4 border-white font-black">
                    {item.quantity}
                  </div>
                </div>
                
                <div className="flex-1 border-b border-gray-50 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-gray-800 text-xl capitalize">{item.name}</h3>
                      {item.note && (
                        <p className="text-gray-400 text-sm mt-1 bg-gray-50 inline-block px-3 py-1 rounded-lg italic">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                    <p className="font-black text-gray-900 text-lg">{(item.price * item.quantity).toFixed(2)} dt</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)} 
                    className="mt-2 text-red-400 text-xs font-bold hover:text-red-600 uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100">
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total to pay</p>
                  <p className="text-3xl font-black text-gray-900">{total.toFixed(2)} dt</p>
                </div>
                <button className="bg-black text-white px-12 py-5 rounded-[24px] font-black text-lg hover:bg-orange-500 transition-all active:scale-95 shadow-2xl shadow-gray-200">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}