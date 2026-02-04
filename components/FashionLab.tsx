
import React, { useState, useRef } from 'react';
import { User, FashionAnalysis } from '../types';
import { analyzeFashion } from '../geminiService';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const FashionLab: React.FC<Props> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FashionAnalysis | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState({ shoulder: 0, waist: 0, hip: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeFashion({
        imageData: activeTab === 'scan' ? photo || undefined : undefined,
        measurements: activeTab === 'manual' ? measurements : undefined
      });
      setResult(data);
    } catch (err) {
      alert("Analisis gagal. Pastikan foto jelas atau ukuran akurat.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-outfit selection:bg-gold selection:text-white">
      {/* TOP BAR (Consistent with Dashboard) */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('#/dashboard')}>
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <i className="fas fa-user-tie text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tighter text-gold leading-none">InviteWeb</h1>
              <span className="text-[7px] uppercase tracking-[0.4em] text-white/40 font-bold">AI Fashion Lab</span>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('#/dashboard')} 
            className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold transition flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!result ? (
          <div className="animate-fade-up max-w-6xl mx-auto">
            {/* INTRO HERO */}
            <div className="text-center mb-16">
              <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Personal AI Stylist</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tighter">Kenali Dirimu,<br/><span className="italic text-gold">Temukan Gayamu.</span></h2>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-light text-lg">
                Teknologi AI Visi kami menganalisis proporsi tubuh dan undertone kulit Anda untuk memberikan rekomendasi outfit yang presisi.
              </p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setActiveTab('scan')}
                  className={`flex-1 py-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all border-r border-slate-100 ${activeTab === 'scan' ? 'bg-slate-50 text-gold' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <i className="fas fa-camera-viewfinder mr-2"></i> AI Visual Scan
                </button>
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${activeTab === 'manual' ? 'bg-slate-50 text-gold' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <i className="fas fa-ruler-horizontal mr-2"></i> Input Manual Ukuran
                </button>
              </div>

              <div className="p-8 md:p-16">
                {activeTab === 'scan' ? (
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="aspect-[3/4] rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-gold relative shadow-inner">
                        {photo ? (
                          <>
                            <img src={photo} className="w-full h-full object-cover" alt="Preview" />
                            {isAnalyzing && (
                              <div className="absolute inset-x-0 top-0 h-1 bg-gold shadow-[0_0_20px_#D4AF37] animate-scan-slow z-10"></div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <i className="fas fa-cloud-upload text-3xl text-gold"></i>
                            </div>
                            <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Upload Foto Seluruh Tubuh</p>
                            <p className="text-[9px] text-slate-300 mt-2">Gunakan pakaian pas badan untuk akurasi tinggi</p>
                          </>
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-2xl font-serif font-bold mb-4">Panduan Analisis:</h3>
                        <div className="space-y-6">
                          {[
                            { t: 'Pakaian Pas Badan', d: 'Hindari pakaian oversize agar AI dapat membaca siluet tubuh Anda.' },
                            { t: 'Posisi Tegak', d: 'Berdiri tegak dengan kaki rapat dan tangan sedikit terbuka.' },
                            { t: 'Pencahayaan Terang', d: 'Pastikan wajah dan warna kulit terlihat jelas tanpa filter.' }
                          ].map((tip, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 font-bold text-xs">{i+1}</div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{tip.t}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">{tip.d}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        disabled={!photo || isAnalyzing}
                        onClick={runAnalysis}
                        className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-gold transition active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                      >
                        {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i> AI Menganalisis...</> : <><i className="fas fa-magic"></i> Mulai Analisis Visual</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {[
                        { key: 'shoulder', label: 'Lebar Bahu', icon: 'fa-arrows-left-right' },
                        { key: 'waist', label: 'Lingkar Pinggang', icon: 'fa-compress' },
                        { key: 'hip', label: 'Lingkar Pinggul', icon: 'fa-expand' }
                      ].map((field) => (
                        <div key={field.key} className="relative">
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{field.label} (CM)</label>
                          <div className="relative">
                             <input 
                              type="number" 
                              placeholder="0"
                              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold focus:bg-white transition-all outline-none font-black text-xl text-slate-800 shadow-inner"
                              onChange={(e) => setMeasurements({...measurements, [field.key]: Number(e.target.value)})}
                            />
                            <i className={`fas ${field.icon} absolute right-6 top-1/2 -translate-y-1/2 text-slate-200`}></i>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-gold transition disabled:opacity-50"
                    >
                      {isAnalyzing ? "Menghitung..." : "Hitung Proporsi Tubuh"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
               <div>
                 <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] mb-2 block">Analysis Report</span>
                 <h2 className="text-5xl font-serif font-bold text-slate-900 tracking-tighter">Profil Gaya Anda</h2>
               </div>
               <div className="flex gap-4">
                 <button 
                  onClick={() => onNavigate('#/dashboard')} 
                  className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                 >
                   <i className="fas fa-arrow-left mr-2"></i> Dashboard
                 </button>
                 <button 
                  onClick={() => setResult(null)} 
                  className="bg-gold text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-gold/20"
                 >
                   <i className="fas fa-redo mr-2"></i> Ulangi Analisis
                 </button>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
               {/* MAIN RESULT COLUMN */}
               <div className="lg:col-span-2 space-y-10">
                  {/* Shape Card */}
                  <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gold"></div>
                    <div className="w-56 h-72 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-9xl shrink-0 shadow-inner border border-slate-100">
                        {result.bodyShape === 'Hourglass' ? '⏳' : result.bodyShape === 'Pear' ? '🍐' : result.bodyShape === 'Apple' ? '🍎' : result.bodyShape === 'Rectangle' ? '📏' : '📐'}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gold/10 text-gold text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Body Profile</div>
                      <h3 className="text-5xl font-serif font-bold mb-6 text-slate-900">{result.bodyShape} <span className="text-gold italic">Shape</span></h3>
                      <p className="text-slate-500 leading-relaxed text-lg font-light mb-8">Proporsi tubuh Anda menunjukkan karakteristik <span className="font-bold text-slate-800">{result.bodyShape}</span>. Fokus gaya terbaik untuk Anda adalah menciptakan siluet yang seimbang dan menonjolkan fitur terbaik Anda.</p>
                      
                      <div className="flex flex-wrap gap-2">
                         {result.recommendations.map((rec, i) => (
                           <span key={i} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">{rec}</span>
                         ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {result.outfits.map((outfit, i) => (
                      <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-50 group hover:bg-slate-900 transition-all duration-700">
                        <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white/10 flex items-center justify-center mb-6 transition-colors">
                           <i className={`fas ${outfit.occasion === 'Formal' ? 'fa-user-tie' : outfit.occasion === 'Casual' ? 'fa-tshirt' : 'fa-glass-cheers'} text-gold`}></i>
                        </div>
                        <p className="text-gold font-black text-[9px] uppercase tracking-widest mb-4 group-hover:text-white/40">{outfit.occasion} Style</p>
                        <ul className="space-y-3 mb-8">
                          {outfit.items.map((item, j) => (
                            <li key={j} className="text-slate-800 font-bold text-sm group-hover:text-white transition-colors">{item}</li>
                          ))}
                        </ul>
                        <p className="text-slate-400 text-[10px] leading-relaxed uppercase tracking-widest font-bold group-hover:text-white/30 transition-colors">{outfit.reason}</p>
                      </div>
                    ))}
                  </div>
               </div>

               {/* SIDEBAR: COLOR & MAKEUP */}
               <div className="space-y-10">
                  <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
                    <h4 className="font-serif font-bold text-2xl mb-8">Skin Power Palette</h4>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Undertone</span>
                       <span className="text-[10px] font-black uppercase text-gold tracking-widest">{result.undertone}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-10">
                       {result.powerColors.map((color, i) => (
                         <div key={i} className="group">
                            <div 
                              className="h-24 rounded-2xl shadow-inner border border-black/5 group-hover:scale-105 transition-transform" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <p className="text-[9px] text-center font-black text-slate-400 mt-3 uppercase tracking-widest">{color}</p>
                         </div>
                       ))}
                    </div>
                    
                    {/* NEW: MAKEUP PALETTE SECTION */}
                    <div className="pt-8 border-t border-slate-50">
                       <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Recommended Makeup Shades</h5>
                       <div className="flex flex-wrap gap-4">
                          {result.makeupPalette && result.makeupPalette.map((shade, idx) => (
                            <div key={idx} className="group relative">
                               <div 
                                 className="w-12 h-12 rounded-full border-4 border-white shadow-lg cursor-help transition-transform hover:scale-110" 
                                 style={{ backgroundColor: shade.hex }}
                               ></div>
                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[8px] font-bold whitespace-nowrap shadow-xl z-20">
                                  {shade.name}
                               </div>
                            </div>
                          ))}
                       </div>
                       <p className="text-[9px] text-slate-400 mt-8 leading-relaxed italic">* Warna di atas dikurasi secara otomatis berdasarkan undertone {result.undertone} Anda agar penampilan semakin elegan.</p>
                    </div>
                  </div>

                  {/* Mission Card */}
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                     <i className="fas fa-gem absolute -bottom-10 -right-10 text-[12rem] text-white/5 rotate-12 transition-transform duration-1000 group-hover:scale-110"></i>
                     <h4 className="font-serif font-bold text-2xl mb-6 relative z-10 text-gold">Fashion Mission</h4>
                     <p className="text-lg text-white/60 leading-relaxed font-light italic relative z-10">"Gayamu adalah caramu berkata siapa dirimu tanpa harus berbicara. Jadikan setiap langkahmu adalah pernyataan kelas."</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white py-12 border-t border-slate-100 mt-20">
         <div className="container mx-auto px-8 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">&copy; 2024 InviteWeb AI Fashion Lab. Premium Edition.</p>
         </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan-slow {
          animation: scan 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FashionLab;
