
import React, { useState, useEffect } from 'react';
import { User, CartItem } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const Cart: React.FC<Props> = ({ user, onNavigate }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(storage.getCart(user.id));
  }, [user.id]);

  const updateAmount = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.productId === productId) {
        return { ...item, amount: Math.max(1, item.amount + delta) };
      }
      return item;
    });
    setCart(updated);
    storage.saveCart(user.id, updated);
  };

  const removeItem = (productId: string) => {
    const updated = cart.filter(item => item.productId !== productId);
    setCart(updated);
    storage.saveCart(user.id, updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.amount), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit">
      <header className="bg-slate-900 text-white sticky top-0 z-50 py-6 border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div onClick={() => onNavigate('#/shop')} className="flex items-center gap-3 cursor-pointer group">
            <i className="fas fa-arrow-left text-gold group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Kembali Belanja</span>
          </div>
          <h1 className="text-xl font-serif font-black text-gold tracking-tighter uppercase">My Luxury Bag</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {cart.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
               {cart.map(item => (
                 <div key={item.productId} className="bg-white rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 items-center border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <img src={item.image} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt={item.name} />
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{item.name}</h3>
                       <p className="text-lg font-black text-gold mb-6 md:mb-0">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl">
                       <button onClick={() => updateAmount(item.productId, -1)} className="text-slate-400 hover:text-slate-900 transition"><i className="fas fa-minus text-xs"></i></button>
                       <span className="font-black text-lg w-8 text-center text-slate-900">{item.amount}</span>
                       <button onClick={() => updateAmount(item.productId, 1)} className="text-slate-400 hover:text-slate-900 transition"><i className="fas fa-plus text-xs"></i></button>
                    </div>
                    <div className="text-right hidden md:block w-32">
                       <p className="text-sm font-black text-slate-900">Rp {(item.price * item.amount).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="w-10 h-10 bg-red-50 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                       <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                 </div>
               ))}
            </div>

            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl sticky top-28">
                  <h4 className="text-xl font-serif font-bold text-gold mb-8">Ringkasan Pesanan</h4>
                  <div className="space-y-4 mb-10 pb-8 border-b border-white/10">
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40">Subtotal</span>
                        <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40">Pengiriman</span>
                        <span className="text-gold font-bold">GRATIS</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-end mb-12">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Tagihan</p>
                     <p className="text-3xl font-black text-gold tracking-tighter">Rp {subtotal.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('#/checkout')}
                    className="w-full bg-gold text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-xl active:scale-95"
                  >
                    Lanjut ke Pembayaran <i className="fas fa-chevron-right ml-2 text-[8px]"></i>
                  </button>
               </div>
               
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Safe & Secure</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">Semua transaksi dienkripsi dan diproses secara aman melalui server Pro.</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-40 text-center bg-white rounded-[5rem] border-2 border-dashed border-slate-100 shadow-inner max-w-2xl mx-auto">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-shopping-bag text-3xl text-slate-200"></i>
             </div>
             <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Keranjang Anda Kosong</h2>
             <p className="text-slate-400 mb-10 font-light">Sepertinya Anda belum menambahkan gaya impian ke keranjang belanja.</p>
             <button onClick={() => onNavigate('#/shop')} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold transition shadow-xl">Buka Katalog Sekarang</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
