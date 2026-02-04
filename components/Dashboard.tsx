
import React, { useState, useEffect } from 'react';
import { User, Invitation, CartItem } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onLogout: () => void;
  onNavigate: (to: string) => void;
}

const Dashboard: React.FC<Props> = ({ user, onLogout, onNavigate }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [view, setView] = useState<'home' | 'list'>('home');
  const [cartCount, setCartCount] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    {
      title: 'AI Fashion Lab',
      desc: 'Analisis bentuk tubuh & rekomendasi outfit presisi.',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      target: '#/fashion-lab',
      badge: 'Advanced AI'
    },
    {
      title: 'Face & Skin Lab',
      desc: 'Deteksi tekstur kulit & panduan makeup artistik.',
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
      target: '#/face-lab',
      badge: 'Precision Lab'
    },
    {
      title: 'Digital Invitations',
      desc: 'Buat undangan eksklusif dengan pesan berbasis AI.',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
      target: 'view:list',
      badge: 'Premium Studio'
    },
    {
      title: 'Exclusive Shop',
      desc: 'Koleksi fashion & skincare kurasi para ahli.',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
      target: '#/shop',
      badge: 'Pro Collection'
    },
    {
      title: 'Order Journal',
      desc: 'Pantau riwayat belanja & status pengiriman.',
      img: 'https://images.unsplash.com/photo-1556742049-3ad54c2d5221?q=80&w=1200&auto=format&fit=crop',
      target: '#/orders',
      badge: 'Transaction Monitor'
    }
  ];

  useEffect(() => {
    setInvitations(storage.getInvitations().filter(i => i.userId === user.id));
    setCartCount(storage.getCart(user.id).reduce((acc, item) => acc + item.amount, 0));
  }, [user.id]);

  // Auto-slide logic
  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [view, features.length]);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus undangan ini?')) {
      storage.deleteInvitation(id);
      setInvitations(invitations.filter(i => i.id !== id));
    }
  };

  const handleSlideClick = (target: string) => {
    if (target === 'view:list') {
      setView('list');
    } else {
      onNavigate(target);
    }
  };

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-outfit">
        <header className="bg-slate-900 text-white pb-4 sticky top-0 z-50 shadow-xl border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-2 text-[9px] opacity-60 tracking-widest font-black uppercase">
              <div className="flex gap-6">
                <span className="text-gold">Member ID: {user.id}</span>
                <span>Pro Membership Active</span>
              </div>
              <div className="flex gap-4 items-center">
                {user.role === 'admin' && (
                  <button onClick={() => onNavigate('#/admin')} className="text-gold hover:underline font-black">ADMIN PANEL</button>
                )}
                <button onClick={onLogout} className="text-red-400 hover:text-red-500 transition">Logout Session</button>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4">
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
                <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-gold/20">
                   <i className="fas fa-user-tie text-white"></i>
                </div>
                <h1 className="text-xl font-serif font-black tracking-tighter text-gold leading-none">InviteWeb</h1>
              </div>
              
              <div className="flex-1 relative">
                <div className="bg-white/5 border border-white/10 rounded-lg flex p-1 transition-all focus-within:bg-white group">
                  <input 
                    type="text" 
                    placeholder="Cari gaya atau kelola acara..." 
                    className="flex-1 bg-transparent px-4 py-2 text-white group-focus-within:text-slate-900 outline-none text-sm"
                  />
                  <button className="bg-gold text-white px-6 py-2 rounded transition-colors hover:bg-slate-900">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 {/* CART ICON */}
                 <div onClick={() => onNavigate('#/cart')} className="relative cursor-pointer group">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-gold hover:text-white transition-all">
                       <i className="fas fa-shopping-cart text-xs"></i>
                    </div>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">{cartCount}</span>
                    )}
                 </div>

                 <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all" onClick={() => setView('home')}>
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=D4AF37&color=fff&size=40&bold=true`} className="w-8 h-8 rounded-full border-2 border-gold shadow-lg" />
                  <div className="hidden md:block">
                     <p className="text-[10px] font-black text-white leading-none">{user.name}</p>
                     <p className="text-[8px] text-gold uppercase tracking-widest mt-1">{user.role === 'admin' ? 'Administrator' : 'Verified Member'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          
          {/* PHOTO GLIDER / FEATURE CAROUSEL */}
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-12 group">
             {features.map((feature, index) => (
               <div 
                 key={index}
                 onClick={() => handleSlideClick(feature.target)}
                 className={`absolute inset-0 transition-all duration-1000 ease-in-out transform cursor-pointer ${
                   index === activeSlide ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-full scale-110 z-0'
                 }`}
               >
                 <img src={feature.img} className="w-full h-full object-cover" alt={feature.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent flex flex-col justify-end p-8 md:p-16">
                    <div className="animate-fade-up">
                       <span className="bg-gold text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full mb-6 inline-block shadow-lg">
                          {feature.badge}
                       </span>
                       <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-none tracking-tighter">
                          {feature.title}
                       </h2>
                       <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed font-light mb-8">
                          {feature.desc}
                       </p>
                       <div className="flex items-center gap-4">
                          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all">
                             Buka Fitur <i className="fas fa-arrow-right ml-2"></i>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
             ))}

             {/* Slide Indicators */}
             <div className="absolute bottom-10 right-10 z-20 flex gap-3">
                {features.map((_, index) => (
                  <button 
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setActiveSlide(index); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index === activeSlide ? 'w-10 bg-gold' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
             </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <h3 className="text-xl font-serif font-black text-slate-800 uppercase tracking-widest">Akses Cepat Layanan</h3>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
             <div onClick={() => setView('list')} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                   <i className="fas fa-envelope-open-text text-xl"></i>
                </div>
                <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800 mb-2">My Invitations</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Kelola dan buat undangan digital eksklusif Anda.</p>
             </div>

             <div onClick={() => onNavigate('#/shop')} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all">
                   <i className="fas fa-shopping-bag text-xl"></i>
                </div>
                <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800 mb-2">Pro Shopping</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Kurasi busana dan aksesori pilihan para stylist.</p>
             </div>

             <div onClick={() => onNavigate('#/orders')} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-all">
                   <i className="fas fa-receipt text-xl"></i>
                </div>
                <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800 mb-2">My Orders</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Pantau status pesanan dan riwayat belanja Anda.</p>
             </div>

             <div onClick={() => onNavigate('#/face-lab')} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
                   <i className="fas fa-face-smile text-xl"></i>
                </div>
                <h4 className="font-black uppercase tracking-widest text-[11px] text-slate-800 mb-2">Face AI Lab</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Analisis wajah untuk makeup & skincare tepat.</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFBF7] font-outfit">
      <div className="w-full md:w-72 bg-slate-900 shadow-2xl p-8 flex flex-col z-20 border-r border-gold/10 text-white">
        <h2 className="text-3xl font-bold font-serif text-gold mb-16 flex items-center gap-3">
          <i className="fas fa-envelope-open-text"></i> InviteWeb
        </h2>
        <div className="mb-10">
          <p className="text-white/20 text-[10px] uppercase font-black mb-6 tracking-[0.2em]">Workspace</p>
          <ul className="space-y-4">
            <li onClick={() => setView('home')} className="text-white/60 hover:text-gold hover:bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all">
              <i className="fas fa-home group-hover:rotate-12 transition-transform"></i> Dashboard Utama
            </li>
            <li onClick={() => onNavigate('#/fashion-lab')} className="text-white/60 hover:text-gold hover:bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all">
              <i className="fas fa-shirt group-hover:rotate-12 transition-transform"></i> Fashion Lab
            </li>
            <li onClick={() => onNavigate('#/face-lab')} className="text-white/60 hover:text-gold hover:bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all">
              <i className="fas fa-face-smile group-hover:rotate-12 transition-transform"></i> Face Lab AI
            </li>
            <li onClick={() => onNavigate('#/shop')} className="text-white/60 hover:text-gold hover:bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all">
              <i className="fas fa-shopping-bag group-hover:rotate-12 transition-transform"></i> Fashion Shop
            </li>
            <li onClick={() => onNavigate('#/orders')} className="text-white/60 hover:text-gold hover:bg-white/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer group transition-all">
              <i className="fas fa-receipt group-hover:rotate-12 transition-transform"></i> Pesanan Saya
            </li>
            <li onClick={() => setView('list')} className="bg-gold text-slate-900 font-bold p-4 rounded-2xl flex items-center gap-4 cursor-pointer shadow-lg shadow-gold/20">
              <i className="fas fa-list"></i> Undangan Saya
            </li>
          </ul>
        </div>
        
        <div className="mt-auto pt-8 border-t border-white/5">
            <button onClick={onLogout} className="w-full bg-white/5 text-white/40 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition shadow-sm">
                Keluar Sesi <i className="fas fa-power-off ml-2"></i>
            </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <button onClick={() => setView('home')} className="text-gold/60 hover:text-gold font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-3 transition-colors">
                <i className="fas fa-arrow-left"></i> Kembali ke Dashboard
            </button>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight">Studio Anda</h1>
          </div>
          <button onClick={() => onNavigate('#/create')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-gold transition shadow-xl shadow-slate-900/10 active:scale-95 transform">
            + Undangan Baru
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {invitations.length > 0 ? invitations.map(inv => (
            <div key={inv.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 px-5 py-2 bg-gold text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">{inv.eventType}</div>
              <h3 className="text-2xl font-bold mb-6 font-serif text-slate-800 leading-tight group-hover:text-gold transition-colors">{inv.eventName}</h3>
              <div className="text-[11px] text-slate-400 mb-8 space-y-3 font-medium">
                <p className="flex items-center gap-3"><i className="fas fa-calendar-alt text-gold/40"></i> {inv.eventDate}</p>
                <p className="flex items-center gap-3"><i className="fas fa-location-dot text-gold/40"></i> {inv.eventLocation}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => onNavigate(`#/invite/${inv.id}`)} className="flex-1 bg-slate-50 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-white transition shadow-sm">Preview</button>
                <button onClick={() => handleDelete(inv.id)} className="w-14 h-14 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm"><i className="fas fa-trash-alt"></i></button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-folder-open text-3xl text-slate-200"></i>
               </div>
               <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Belum Ada Undangan</p>
               <button onClick={() => onNavigate('#/create')} className="text-gold font-black uppercase tracking-[0.3em] text-[10px] border-b-2 border-gold pb-2 hover:tracking-[0.4em] transition-all mt-6">Mulai Buat Sekarang</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
