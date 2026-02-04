
import React, { useState, useEffect } from 'react';
import { User, CartItem, Order, OrderItem } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const Checkout: React.FC<Props> = ({ user, onNavigate }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'Credit Card'
  });

  useEffect(() => {
    const data = storage.getCart(user.id);
    if (data.length === 0) onNavigate('#/cart');
    setCart(data);
  }, [user.id, onNavigate]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.amount), 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address) {
      alert("Harap masukkan alamat pengiriman.");
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Gateway Delay
    setTimeout(() => {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.productId,
        name: item.name,
        priceAtPurchase: item.price,
        amount: item.amount
      }));

      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        items: orderItems,
        totalPrice: subtotal,
        shippingAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      storage.addOrder(newOrder);
      storage.clearCart(user.id);
      
      setIsProcessing(false);
      alert("Pesanan Berhasil! Tim kami akan segera mengirimkan item Anda.");
      onNavigate('#/orders');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit">
      <header className="bg-slate-900 text-white sticky top-0 z-50 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div onClick={() => onNavigate('#/cart')} className="flex items-center gap-3 cursor-pointer group">
            <i className="fas fa-arrow-left text-gold"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Kembali ke Keranjang</span>
          </div>
          <h1 className="text-xl font-serif font-black text-gold tracking-tighter uppercase">Luxury Checkout</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
           {/* SHIPPING & PAYMENT FORM */}
           <div className="lg:col-span-7 space-y-12">
              <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-serif font-bold text-slate-900 mb-10 flex items-center gap-4">
                    <span className="w-10 h-10 bg-gold rounded-xl text-white flex items-center justify-center text-sm font-black">1</span>
                    Informasi Pengiriman
                 </h2>
                 <div className="space-y-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Alamat Lengkap (Beserta Kota & Kode Pos)</label>
                    <textarea 
                      required 
                      rows={5}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-gold focus:bg-white transition-all outline-none resize-none text-slate-800 shadow-inner"
                      placeholder="E.g. Jalan Kemang Raya No. 12, Jakarta Selatan, 12730"
                    ></textarea>
                 </div>
              </section>

              <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-serif font-bold text-slate-900 mb-10 flex items-center gap-4">
                    <span className="w-10 h-10 bg-gold rounded-xl text-white flex items-center justify-center text-sm font-black">2</span>
                    Metode Pembayaran
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Credit Card', 'Bank Transfer', 'GoPay / OVO', 'Pro Points'].map(method => (
                      <div 
                        key={method}
                        onClick={() => setFormData({...formData, paymentMethod: method})}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${formData.paymentMethod === method ? 'border-gold bg-gold/5 shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-white'}`}
                      >
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? 'border-gold bg-gold' : 'border-slate-300'}`}>
                            {formData.paymentMethod === method && <div className="w-2 h-2 bg-white rounded-full"></div>}
                         </div>
                         <span className="font-bold text-slate-800 text-sm">{method}</span>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* ORDER SUMMARY SIDEBAR */}
           <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl sticky top-32 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full"></div>
                 <h3 className="text-xl font-serif font-bold text-gold mb-10 relative z-10">Ringkasan Pesanan</h3>
                 
                 <div className="space-y-6 mb-10 max-h-60 overflow-y-auto custom-scrollbar pr-4 relative z-10">
                    {cart.map(item => (
                      <div key={item.productId} className="flex justify-between items-center gap-4 border-b border-white/5 pb-4">
                         <div className="flex items-center gap-4">
                            <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                               <p className="font-bold text-sm truncate w-32">{item.name}</p>
                               <p className="text-[10px] text-white/40">{item.amount} x Rp {item.price.toLocaleString()}</p>
                            </div>
                         </div>
                         <p className="font-black text-sm">Rp {(item.price * item.amount).toLocaleString()}</p>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-4 mb-10 border-t border-white/10 pt-8 relative z-10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                       <span>Subtotal</span>
                       <span className="text-white">Rp {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                       <span>Shipping Cost</span>
                       <span className="text-gold">COMPLIMENTARY</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-end mb-12 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Grand Total</p>
                    <p className="text-4xl font-black text-gold tracking-tighter">Rp {subtotal.toLocaleString()}</p>
                 </div>

                 <button 
                   type="submit"
                   disabled={isProcessing}
                   className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${isProcessing ? 'bg-slate-800 text-white/40 cursor-wait' : 'bg-gold text-slate-900 hover:bg-white'}`}
                 >
                   {isProcessing ? (
                     <><i className="fas fa-spinner fa-spin"></i> Processing Secure Payment...</>
                   ) : (
                     <><i className="fas fa-lock text-[10px]"></i> Konfirmasi & Bayar</>
                   )}
                 </button>

                 <div className="mt-8 text-center opacity-20 relative z-10">
                    <i className="fas fa-fingerprint text-4xl"></i>
                    <p className="text-[8px] font-black uppercase tracking-widest mt-2">Authenticated Purchase</p>
                 </div>
              </div>
           </div>
        </form>
      </main>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white">
           <div className="w-24 h-24 relative mb-10">
              <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <i className="fas fa-gem absolute inset-0 flex items-center justify-center text-gold animate-pulse"></i>
           </div>
           <h4 className="text-2xl font-serif font-bold text-gold mb-2">Mengamankan Transaksi Anda</h4>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-40">Mohon jangan menutup halaman ini...</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
