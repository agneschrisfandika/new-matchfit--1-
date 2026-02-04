
import React, { useState, useEffect } from 'react';

interface Props {
  onNavigate: (to: string) => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const premiumFeatures = [
    {
      title: 'AI Fashion Lab',
      category: 'Advanced AI',
      desc: 'Analisis proporsi tubuh & rekomendasi gaya presisi tinggi untuk penampilan sempurna di setiap acara.',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      badge: 'Fashion Intelligence',
      icon: 'fa-shirt'
    },
    {
      title: 'Face & Skin Lab',
      category: 'Precision Lab',
      desc: 'Deteksi tekstur kulit & panduan makeup artistik berbasis AI yang disesuaikan dengan struktur wajah unik Anda.',
      img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600&auto=format&fit=crop',
      badge: 'Aesthetic Vision',
      icon: 'fa-face-smile'
    },
    {
      title: 'AI Event Studio',
      category: 'Creative Studio',
      desc: 'Ciptakan undangan eksklusif dengan narasi AI memikat dan desain mewah yang akan mengesankan tamu Anda.',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop',
      badge: 'Signature Invitation',
      icon: 'fa-wand-magic-sparkles'
    },
    {
      title: 'Exclusive Shop',
      category: 'VIP Collection',
      desc: 'Akses ke koleksi fashion & beauty yang dikurasi oleh pakar gaya internasional khusus untuk member pro.',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
      badge: 'Curation House',
      icon: 'fa-shopping-bag'
    }
  ];

  const popularCollections = [
    { title: 'Velvet Royal', category: 'PREMIUM', tag: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop' },
    { title: 'Neon Pulse', category: 'MODERN', tag: 'BIRTHDAY', img: 'https://images.unsplash.com/photo-1530103862676-fa8c91bbe343?q=80&w=400&auto=format&fit=crop' },
    { title: 'Olive Sacred', category: 'FREE', tag: 'RELIGIOUS', img: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=400&auto=format&fit=crop' },
    { title: 'Midnight Gala', category: 'PREMIUM', tag: 'GRADUATION', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop' },
    { title: 'Pastel Dream', category: 'FREE', tag: 'BABY SHOWER', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop' },
    { title: 'Classic Gold', category: 'VIP', tag: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1512389055488-8d82cb26ba6c?q=80&w=400&auto=format&fit=crop' }
  ];

  const quickLinks = [
    { label: 'AI SCAN PRO', icon: 'fa-fingerprint', color: 'bg-slate-50 text-slate-400' },
    { label: 'BODY SHAPE', icon: 'fa-user-check', color: 'bg-blue-50 text-blue-500' },
    { label: 'COLOR THEORY', icon: 'fa-palette', color: 'bg-pink-50 text-pink-500' },
    { label: 'SMART WARDROBE', icon: 'fa-shirt', color: 'bg-indigo-50 text-indigo-500' },
    { label: 'WEDDING STYLE', icon: 'fa-gem', color: 'bg-emerald-50 text-emerald-500' },
    { label: 'PARTY OUTFIT', icon: 'fa-glass-cheers', color: 'bg-amber-50 text-amber-500' },
    { label: 'EVENT STUDIO', icon: 'fa-envelope-open-text', color: 'bg-slate-50 text-slate-500' },
    { label: 'STYLE BLOG', icon: 'fa-newspaper', color: 'bg-purple-50 text-purple-500' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % premiumFeatures.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [premiumFeatures.length]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-outfit selection:bg-gold selection:text-white overflow-x-hidden">
      {/* CINEMATIC NAVIGATION HEADER */}
      <header className="fixed top-0 inset-x-0 z-[60] transition-all duration-500 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg shadow-gold/20">
                <i className="fas fa-user-tie text-xl text-white"></i>
              </div>
              <h1 className="text-2xl font-serif font-black tracking-tighter text-gold leading-none">InviteWeb</h1>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              {['Home', 'AI Fashion', 'Digital Invite', 'Pro Shop', 'AI Face Lab'].map((nav) => (
                <button key={nav} onClick={() => onNavigate('#/register')} className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold transition-colors">{nav}</button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('#/login')} className="text-[10px] font-black text-white/60 uppercase tracking-widest hover:text-white">Member</button>
            <button onClick={() => onNavigate('#/register')} className="bg-gold text-white px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-white hover:text-slate-950 transition-all">Sign Up Free</button>
          </div>
        </div>
      </header>

      {/* DYNAMIC HERO SLIDER */}
      <main>
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
          {premiumFeatures.map((f, i) => (
            <div 
              key={i} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === activeIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            >
              <img src={f.img} className="w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
            </div>
          ))}

          <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
            <div className="max-w-3xl animate-fade-up">
              <div className="flex items-center gap-4 mb-5">
                <span className="bg-gold text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] shadow-lg shadow-gold/20">
                  {premiumFeatures[activeIdx].badge}
                </span>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Global Experience • Pro Edition</span>
              </div>
              
              <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-5 leading-none tracking-tighter">
                {premiumFeatures[activeIdx].title}
              </h2>
              
              <div className="flex items-center gap-3 text-gold font-black text-[11px] uppercase tracking-widest mb-6">
                <span className="bg-white/10 px-3 py-1 rounded border border-white/5">{premiumFeatures[activeIdx].category}</span>
                <span>•</span>
                <span>Gemini 3 Powered</span>
                <span>•</span>
                <span className="flex items-center gap-1"><i className="fas fa-star text-[8px]"></i> 4.9 Rating</span>
              </div>

              <p className="text-white/60 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
                {premiumFeatures[activeIdx].desc}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                {premiumFeatures.map((f, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`relative w-24 h-14 md:w-32 md:h-18 rounded-xl overflow-hidden transition-all duration-300 transform ${i === activeIdx ? 'border-2 border-gold scale-105 shadow-2xl z-20' : 'border border-white/10 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={f.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => onNavigate('#/register')} className="bg-white text-slate-950 px-10 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all shadow-2xl flex items-center gap-4">
                  Explore Feature <i className="fas fa-play text-[8px]"></i>
                </button>
                <button onClick={() => onNavigate('#/register')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all">
                  Join Membership
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK LINKS ICON BAR */}
        <section className="relative z-20 -mt-12 md:-mt-20 px-4">
           <div className="container mx-auto">
              <div className="bg-white rounded-[2.5rem] md:rounded-full p-5 md:px-10 md:py-6 shadow-2xl shadow-slate-200 border border-slate-50 flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-3">
                 {quickLinks.map((link, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => onNavigate('#/register')}>
                      <div className={`w-11 h-11 md:w-14 md:h-14 ${link.color} rounded-full flex items-center justify-center text-base md:text-lg shadow-inner transition-transform duration-500 group-hover:scale-110`}>
                         <i className={`fas ${link.icon}`}></i>
                      </div>
                      <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-gold transition-colors">{link.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ECOSYSTEM SECTION */}
        <section className="bg-white py-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-5 mb-10">
               <div className="text-center md:text-left">
                  <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] block mb-2">Premium Ecosystem</span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tighter">Layanan Eksklusif Kami</h3>
               </div>
               <div className="h-px bg-slate-200 flex-1 hidden md:block"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {premiumFeatures.map((feature, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => onNavigate('#/register')}
                   className="group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-700 bg-white"
                 >
                   <img src={feature.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={feature.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] transform transition-transform duration-500 group-hover:-translate-y-2">
                         <div className="w-9 h-9 bg-gold text-white rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:rotate-12 transition-transform">
                            <i className={`fas ${feature.icon} text-sm`}></i>
                         </div>
                         <span className="text-gold font-black uppercase tracking-widest text-[8px] mb-1.5 block">{feature.badge}</span>
                         <h4 className="text-white font-bold text-lg mb-2 font-serif leading-none tracking-tight">{feature.title}</h4>
                         <p className="text-white/50 text-[10px] leading-relaxed font-light line-clamp-2">{feature.desc}</p>
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* AI LAB FEATURE SECTION */}
        <section className="bg-white py-20 px-4 overflow-hidden">
           <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group aspect-[4/5] bg-slate-900 max-w-lg mx-auto lg:mx-0">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
                <div className="absolute inset-x-0 h-[2px] bg-gold shadow-[0_0_25px_#D4AF37] animate-scan-slow top-0 z-20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                   <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] text-white max-w-sm text-center shadow-2xl">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse">
                         <i className="fas fa-fingerprint text-2xl"></i>
                      </div>
                      <h5 className="font-black uppercase tracking-[0.3em] text-[10px] mb-3 text-gold">AI Engine Analyzing...</h5>
                      <div className="space-y-2.5">
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gold w-3/4 animate-pulse"></div>
                         </div>
                         <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-widest font-bold">Mendeteksi lekukan tubuh, proporsi tinggi, dan pigmen kulit dasar.</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="space-y-10">
                <div>
                  <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] block mb-4">Personal Style Revolution</span>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tighter">Transformasi Gaya Dengan<br/><span className="text-gold italic">Akurasi Visual AI.</span></h3>
                </div>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed font-light">Algoritma asisten fashion kami dilatih oleh kurator gaya profesional untuk memberikan saran objektif yang meningkatkan kepercayaan diri Anda di setiap acara.</p>
                <div className="grid gap-6">
                   {[
                     { t: 'Body Shape Identification', d: 'Analisis geometri tubuh (Hourglass, Pear, dll) secara instan.', icon: 'fa-vector-square' },
                     { t: 'Skin Tone Mastery', d: 'Temukan palet warna "Power Color" yang membuat kulit Anda bersinar.', icon: 'fa-palette' },
                     { t: 'Smart Outfit Matching', d: 'Rekomendasi busana berdasarkan acara dan profil unik Anda.', icon: 'fa-wand-magic-sparkles' }
                   ].map((feat, idx) => (
                     <div key={idx} className="flex gap-5 group items-start">
                        <div className="w-12 h-12 bg-white shadow-md rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all shrink-0 border border-slate-50">
                           <i className={`fas ${feat.icon} text-sm`}></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-800 mb-0.5 text-sm md:text-base">{feat.t}</h4>
                           <p className="text-slate-400 text-xs md:text-sm">{feat.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        </section>

        {/* KOLEKSI TERPOPULER */}
        <section className="bg-white py-16 px-4 overflow-hidden">
           <div className="container mx-auto">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                 <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gold/10 rounded-lg flex items-center justify-center">
                       <i className="fas fa-crown text-gold text-[10px]"></i>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tighter italic">Koleksi Terpopuler</h3>
                 </div>
                 <button onClick={() => onNavigate('#/register')} className="text-[9px] font-black uppercase tracking-[0.2em] text-gold border-b-2 border-gold pb-1 hover:text-slate-900 hover:border-slate-900 transition-all">Lihat Semua Tema</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                 {popularCollections.map((item, idx) => (
                   <div key={idx} onClick={() => onNavigate('#/register')} className="group cursor-pointer">
                      <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-3 shadow-sm group-hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
                         <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                         <div className="absolute top-3 left-3">
                            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[6px] md:text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                               {item.tag}
                            </span>
                         </div>
                      </div>
                      <h4 className="text-slate-900 font-bold text-[11px] mb-0.5 group-hover:text-gold transition-colors">{item.title}</h4>
                      <p className="text-gold font-black text-[8px] uppercase tracking-widest">{item.category}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-white py-12 px-4">
           <div className="container mx-auto">
              <div className="bg-gold rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden group shadow-2xl shadow-gold/20">
                 <div className="absolute top-0 left-10 opacity-10 pointer-events-none transform -rotate-12">
                    <i className="fas fa-envelope-open-text text-[15rem] text-white"></i>
                 </div>
                 
                 <div className="relative z-10 animate-fade-up">
                    <span className="text-white font-black uppercase tracking-[0.5em] text-[9px] block mb-5 opacity-60">Complete Event Experience</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight tracking-tighter">Sudah Siap Tampil?<br/>Bagikan Kebahagiaan Anda.</h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-10 text-sm md:text-base font-light leading-relaxed">
                       Buat undangan digital eksklusif yang menyempurnakan penampilan Anda. Integrasi desain premium dalam satu ketukan.
                    </p>
                    <button 
                      onClick={() => onNavigate('#/register')} 
                      className="bg-slate-900 text-white px-10 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-slate-900 transition-all transform hover:scale-105 active:scale-95"
                    >
                       Buat Undangan Sekarang
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-black text-white py-16 border-t border-white/5">
         <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
               <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                     <i className="fas fa-user-tie text-2xl text-gold"></i>
                     <h2 className="text-xl font-serif font-black text-gold tracking-tighter">InviteWeb Pro</h2>
                  </div>
                  <p className="text-white/40 max-w-sm leading-relaxed mb-6 mx-auto md:mx-0 text-sm">Platform gaya hidup digital yang menggabungkan kecerdasan buatan dengan seni perencanaan acara. Memberikan pengalaman eksklusif bagi Anda yang menghargai kualitas.</p>
               </div>
               <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-white/60 mb-6">Layanan</h4>
                  <ul className="space-y-3 text-xs text-white/30">
                     <li className="hover:text-gold cursor-pointer transition">AI Fashion Lab</li>
                     <li className="hover:text-gold cursor-pointer transition">Digital Invitation</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-white/60 mb-6">Bantuan</h4>
                  <ul className="space-y-3 text-xs text-white/30">
                     <li className="hover:text-gold cursor-pointer transition">Pusat Panduan</li>
                     <li className="hover:text-gold cursor-pointer transition">Kebijakan Privasi</li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-white/5 text-center">
               <p className="text-white/10 text-[8px] uppercase tracking-[0.8em] font-bold">&copy; 2024 AI Fashion & Events Laboratory. Premium Studio.</p>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan-slow {
          animation: scan 4s infinite ease-in-out;
        }
        .container {
          max-width: 1300px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
