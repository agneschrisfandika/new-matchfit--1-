
import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const OrderHistory: React.FC<Props> = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(storage.getOrders().filter(o => o.userId === user.id));
  }, [user.id]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit">
      <header className="bg-slate-900 text-white py-8 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div onClick={() => onNavigate('#/dashboard')} className="flex items-center gap-3 cursor-pointer group">
            <i className="fas fa-arrow-left text-gold"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Kembali ke Studio</span>
          </div>
          <h1 className="text-xl font-serif font-black text-gold tracking-tighter uppercase">Order Journal</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {orders.length > 0 ? (
            orders.slice().reverse().map(order => (
              <div key={order.id} className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-8 py-3 bg-slate-900 text-gold text-[9px] font-black uppercase tracking-widest rounded-bl-[2rem]">
                   #{order.id.toUpperCase()}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-50 pb-8">
                   <div>
                      <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest block mb-1">Status Pengiriman</span>
                      <div className="flex items-center gap-3">
                         <span className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'pending' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                         <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest">
                           {order.status === 'pending' ? 'Sedang Diproses' : (order.status === 'shipped' ? 'Dalam Perjalanan' : 'Telah Sampai')}
                         </span>
                      </div>
                   </div>
                   <div className="text-left md:text-right">
                      <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest block mb-1">Tanggal Transaksi</span>
                      <p className="font-bold text-slate-800 text-sm">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>

                <div className="space-y-6 mb-10">
                   {order.items.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 font-black text-slate-900 text-xs">
                              {item.amount}x
                           </div>
                           <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        </div>
                        <p className="font-bold text-slate-900">Rp {(item.priceAtPurchase * item.amount).toLocaleString()}</p>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-6">
                   <div className="max-w-xs">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <i className="fas fa-location-dot"></i> Tujuan Pengiriman
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{order.shippingAddress}</p>
                   </div>
                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Nilai Pesanan</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">Rp {order.totalPrice.toLocaleString()}</p>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 text-center bg-white rounded-[5rem] border-2 border-dashed border-slate-100 shadow-inner">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-receipt text-3xl text-slate-200"></i>
               </div>
               <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Belum Ada Transaksi</h2>
               <p className="text-slate-400 mb-10">Daftar pesanan Anda akan muncul di sini setelah Anda berbelanja.</p>
               <button onClick={() => onNavigate('#/shop')} className="text-gold font-black uppercase tracking-[0.3em] text-[10px] border-b-2 border-gold pb-2 hover:tracking-[0.4em] transition-all">Eksplorasi Katalog Gaya</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
