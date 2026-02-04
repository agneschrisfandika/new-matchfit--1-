
import React, { useState, useRef, useEffect } from 'react';
import { User, FaceAnalysis, SkinType } from '../types';
import { analyzeFace } from '../geminiService';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

// Komponen Ilustrasi Shading Dinamis
const ShadingMap: React.FC<{ shape: string }> = ({ shape }) => {
  const s = shape.toLowerCase();
  
  const isOval = s.includes('oval');
  const isRound = s.includes('bulat') || s.includes('round');
  const isSquare = s.includes('persegi') || s.includes('square');
  const isHeart = s.includes('hati') || s.includes('heart');
  const isDiamond = s.includes('diamond');
  const isLong = s.includes('panjang') || s.includes('long');

  return (
    <div className="relative w-full aspect-square bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center p-10 overflow-hidden group shadow-inner">
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
        <path 
          d={
            isOval ? "M100,20 C150,20 180,70 180,130 C180,190 150,230 100,230 C50,230 20,190 20,130 C20,70 50,20 100,20" :
            isRound ? "M100,30 C160,30 185,80 185,130 C185,180 160,230 100,230 C40,230 15,180 15,130 C15,80 40,30 100,30" :
            isSquare ? "M100,20 C160,20 175,60 175,120 C175,180 165,225 100,225 C35,225 25,180 25,120 C25,60 40,20 100,20" :
            isHeart ? "M100,30 C160,30 180,80 180,120 C180,160 140,210 100,230 C60,210 20,160 20,120 C20,80 40,30 100,30" :
            isDiamond ? "M100,20 C140,20 185,90 185,130 C185,170 140,230 100,230 C60,230 15,170 15,130 C15,90 60,20 100,20" :
            "M100,10 C140,10 165,60 165,130 C165,200 140,240 100,240 C60,240 35,200 35,130 C35,60 60,10 100,10"
          }
          fill="#FFE0BD"
          className="transition-all duration-1000"
        />

        <g opacity="0.4" fill="#8B5E3C">
          {(isOval || isSquare || isRound || isLong) && <path d="M40,40 Q100,20 160,40 Q100,35 40,40" />}
          <ellipse cx="40" cy="140" rx="15" ry="25" transform="rotate(-15 40 140)" />
          <ellipse cx="160" cy="140" rx="15" ry="25" transform="rotate(15 160 140)" />
          {(isSquare || isRound || isDiamond) && (
            <>
              <path d="M30,190 Q50,220 80,225 Q50,210 30,190" />
              <path d="M170,190 Q150,220 120,225 Q150,210 170,190" />
            </>
          )}
        </g>

        <g opacity="0.6" fill="#FFF8E7">
          <path d="M85,45 Q100,40 115,45 L105,135 Q100,140 95,135 Z" />
          <ellipse cx="100" cy="210" rx="20" ry="10" />
          <path d="M45,100 Q65,115 85,100 Q65,105 45,100" />
          <path d="M115,100 Q135,115 155,100 Q135,105 115,100" />
        </g>

        <g opacity="0.2">
          <circle cx="65" cy="95" r="8" fill="black" />
          <circle cx="135" cy="95" r="8" fill="black" />
          <path d="M95,145 Q100,150 105,145" stroke="black" strokeWidth="2" fill="none" />
          <path d="M80,185 Q100,200 120,185" stroke="red" strokeWidth="1" fill="none" />
        </g>
      </svg>
      
      <div className="absolute bottom-6 inset-x-0 text-center">
         <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            {shape} Shading Map
         </span>
      </div>
    </div>
  );
};

const FaceLab: React.FC<Props> = ({ user, onNavigate }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FaceAnalysis | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [skinType, setSkinType] = useState<SkinType>('Normal');
  const [concerns, setConcerns] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const skinConcerns = [
    'Acne / Jerawat', 'Aging / Kerutan', 'Hyperpigmentation', 
    'Dullness / Kusam', 'Redness / Kemerahan', 'Large Pores',
    'Blackheads / Komedo', 'Uneven Skin Tone'
  ];

  const toggleConcern = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Tidak dapat mengakses kamera.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!photo) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeFace({
        imageData: photo,
        skinType,
        concerns
      });
      setResult(data);
    } catch (err) {
      alert("Analisis wajah gagal. Pastikan foto wajah terlihat jelas dan pencahayaan cukup.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-outfit">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('#/dashboard')}>
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <i className="fas fa-face-smile text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-serif font-black text-gold leading-none">Face AI Lab</h1>
              <span className="text-[7px] uppercase tracking-[0.4em] text-white/40 font-bold">Precision Skincare & Makeup</span>
            </div>
          </div>
          <button onClick={() => onNavigate('#/dashboard')} className="text-[10px] font-black uppercase text-white/60 hover:text-gold transition flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!result ? (
          <div className="animate-fade-up max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-100 overflow-hidden relative aspect-square flex flex-col items-center justify-center">
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[2.5rem]" />
                    <button onClick={capturePhoto} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gold group transition-all">
                       <div className="w-10 h-10 bg-gold rounded-full group-active:scale-90 transition-transform"></div>
                    </button>
                  </div>
                ) : photo ? (
                  <div className="relative w-full h-full">
                    <img src={photo} className="w-full h-full object-cover rounded-[2.5rem]" alt="Preview" />
                    <button onClick={() => setPhoto(null)} className="absolute top-6 right-6 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><i className="fas fa-times"></i></button>
                  </div>
                ) : (
                  <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200 text-4xl">
                      <i className="fas fa-camera"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-2">Ambil Foto Wajah</h3>
                      <p className="text-xs text-slate-400">Gunakan pencahayaan natural untuk hasil terbaik.</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={startCamera} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold transition">Open Camera</button>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gold hover:text-gold transition">Upload Foto</button>
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} />
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} hidden />
              </div>

              {photo && (
                <div className="bg-gold p-8 rounded-[2.5rem] text-white shadow-xl shadow-gold/20">
                  <div className="flex items-center gap-4 mb-4">
                    <i className="fas fa-wand-magic-sparkles animate-pulse"></i>
                    <h4 className="font-bold uppercase tracking-widest text-xs">Ready for Analysis</h4>
                  </div>
                  <p className="text-sm font-light leading-relaxed">AI kami siap menganalisis struktur wajah, tekstur kulit, dan memberikan rekomendasi personal untuk Anda.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100 space-y-12">
               <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Profil Kulit</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Jenis Kulit Anda</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setSkinType(type as SkinType)}
                            className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${skinType === type ? 'bg-gold border-gold text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-gold hover:text-gold'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Keluhan Kulit (Pilih Beberapa)</label>
                      <div className="flex flex-wrap gap-2">
                        {skinConcerns.map(concern => (
                          <button 
                            key={concern}
                            onClick={() => toggleConcern(concern)}
                            className={`px-4 py-2 rounded-full text-[9px] font-bold transition-all border ${concerns.includes(concern) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                          >
                            {concern}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>

               <button 
                 disabled={!photo || isAnalyzing}
                 onClick={runAnalysis}
                 className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-gold transition active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
               >
                 {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i> AI Menganalisis Wajah...</> : <><i className="fas fa-magic"></i> Mulai Analisis Wajah</>}
               </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up space-y-16 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
               <div className="text-center md:text-left">
                 <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] mb-3 block">Premium Aesthetic Report</span>
                 <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tighter leading-tight">Your Facial Identity</h2>
               </div>
               <button onClick={() => setResult(null)} className="px-10 py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-gold hover:border-gold transition-all shadow-sm">
                 <i className="fas fa-redo mr-3"></i> Ulangi Analisis
               </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-start">
              {/* MAIN CONTENT AREA */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* 1. MAPPING & REFERENCE SECTION */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Visual Shading Map */}
                  <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-slate-100 flex flex-col">
                    <div className="mb-10">
                      <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">Visual Face Mapping</span>
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mt-2">Personal Shading</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
                        Pola kontur spesifik untuk wajah berbentuk <span className="text-gold font-bold uppercase tracking-widest">{result.faceShape}</span>.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <ShadingMap shape={result.faceShape} />
                    </div>
                  </div>

                  {/* Face Shape Guide Reference */}
                  <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border border-slate-100 flex flex-col">
                    <div className="mb-10">
                      <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">Reference Library</span>
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mt-2">Guide Referensi</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
                        Panduan visual teknik aplikasi untuk berbagai struktur wajah universal.
                      </p>
                    </div>
                    <div className="mt-auto rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-inner group cursor-zoom-in">
                       <img 
                        src="https://i.ibb.co/Fr30BKW/Screenshot-2026-01-22-124657.png" 
                        alt="Face Shape Guide Reference" 
                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CORE BIOMETRICS */}
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden h-fit">
                  <i className="fas fa-dna absolute -right-20 -bottom-20 text-[20rem] text-white/5 rotate-12 pointer-events-none"></i>
                  <div className="grid md:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-10">
                      <div>
                        <span className="text-[9px] font-black text-gold uppercase tracking-[0.5em]">Pigmentation & Biology</span>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-gold mt-3 leading-tight">{result.skinTone}</h3>
                        <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Undertone: {result.undertone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10">
                           <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Estimasi Usia</p>
                           <p className="text-3xl font-bold leading-none">{result.facialAge} <span className="text-xs font-light text-white/40">Thn</span></p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10">
                           <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Bentuk Dasar</p>
                           <p className="text-xl font-bold leading-tight">{result.faceShape}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                       <h4 className="font-serif font-bold text-2xl text-white border-b border-white/10 pb-6">Feature Analysis</h4>
                       <div className="space-y-6">
                          {[
                            { l: 'Mata', v: result.features.eyes, i: 'fa-eye' },
                            { l: 'Hidung', v: result.features.nose, i: 'fa-nose' },
                            { l: 'Bibir', v: result.features.mouth, i: 'fa-lips' },
                            { l: 'Proporsi Alis', v: result.features.eyeToBrowDistance, i: 'fa-lines-leaning' }
                          ].map(f => (
                            <div key={f.l} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 group">
                               <div className="flex items-center gap-4 shrink-0">
                                  <i className={`fas ${f.i} text-gold/30 group-hover:text-gold transition-colors`}></i>
                                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest whitespace-nowrap">{f.l}</span>
                               </div>
                               <span className="text-sm font-bold text-white/80 leading-relaxed text-left sm:text-right">{f.v}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* 3. MAKEUP ARTISTRY SECTION */}
                <div className="space-y-10">
                   <div className="flex items-center gap-6">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 whitespace-nowrap">Premium Makeup Routine</h3>
                      <div className="h-px bg-slate-200 flex-1"></div>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-8">
                      {result.makeupRecommendations.map((rec, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] space-y-8 shadow-lg border border-slate-50 hover:shadow-2xl transition-all relative group overflow-hidden h-fit">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                           
                           <div className="flex items-center gap-5 relative z-10">
                              <div className="w-12 h-12 bg-slate-900 text-gold rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0">
                                 {i+1}
                              </div>
                              <h4 className="font-serif font-bold text-xl text-slate-800 leading-tight">{rec.category}</h4>
                           </div>
                           
                           <div className="space-y-4 relative z-10">
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">{rec.suggestion}</p>
                              <div className="flex flex-wrap gap-3">
                                {rec.shape && <span className="bg-slate-50 text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 leading-none">{rec.shape}</span>}
                                {rec.shadingTechnique && <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-gold/10 leading-none">{rec.shadingTechnique}</span>}
                              </div>
                           </div>

                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative z-10 h-fit">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <i className="fas fa-quote-left text-gold"></i> Pro Application Tips
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed italic">"{rec.applicationTips}"</p>
                           </div>
                           
                           <div className="pt-4 relative z-10">
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.25em] mb-5 leading-none">Color Swatches</p>
                              <div className="flex flex-wrap gap-5">
                                 {rec.palette.map((color, idx) => (
                                   <div key={idx} className="group relative">
                                      <div 
                                        className="w-12 h-12 rounded-full shadow-lg border-4 border-white group-hover:scale-110 transition-transform cursor-help"
                                        style={{ backgroundColor: color.hex }}
                                      ></div>
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[8px] font-bold whitespace-nowrap shadow-xl">
                                         {color.name}
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* SIDEBAR: SECONDARY REPORTS */}
              <div className="lg:col-span-4 space-y-12 h-fit">
                 {/* Skincare Routine & Internal Nutrients - Non-sticky to prevent clipping */}
                 <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-xl border border-slate-100 h-fit">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-inner">
                       <i className="fas fa-vial-circle-check text-2xl"></i>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-slate-900 mb-6 leading-tight">Skincare Intelligence</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-10 italic">"{result.skincareRoutine.explanation}"</p>
                    
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 leading-none">
                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> Hero Ingredients
                          </p>
                          <div className="flex flex-wrap gap-2">
                             {result.skincareRoutine.recommendedIngredients.map((ing, i) => (
                               <span key={i} className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[10px] font-bold border border-green-100 leading-tight">{ing}</span>
                             ))}
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 leading-none">
                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span> Avoid Ingredients
                          </p>
                          <div className="flex flex-wrap gap-2">
                             {result.skincareRoutine.avoidIngredients.map((ing, i) => (
                               <span key={i} className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-[10px] font-bold border border-red-100 leading-tight">{ing}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                    
                    {/* INTERNAL NUTRIENTS - FULLY VISIBLE VERSION WITH NO OVERFLOW LIMITS */}
                    <div className="mt-12 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 h-fit">
                       <h5 className="font-serif font-bold text-xl text-slate-900 mb-6 leading-tight">Internal Nutrients</h5>
                       <div className="space-y-10">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Power Foods (Recommended)</p>
                             <div className="flex flex-col gap-4">
                                {result.dietaryTips.recommended.map((food, i) => (
                                  <div key={i} className="text-xs font-medium text-slate-600 flex items-start gap-3 leading-relaxed">
                                    <i className="fas fa-check-circle text-[10px] text-green-500 shrink-0 mt-1"></i> 
                                    <span>{food}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div className="pt-2">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">Limit Intake (Avoid)</p>
                             <div className="flex flex-col gap-4">
                                {result.dietaryTips.avoid.map((food, i) => (
                                  <div key={i} className="text-xs font-medium text-slate-600 flex items-start gap-3 leading-relaxed">
                                    <i className="fas fa-times-circle text-[10px] text-red-400 shrink-0 mt-1"></i> 
                                    <span>{food}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Premium Quote Card */}
                 <div className="bg-gold p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group h-fit">
                    <i className="fas fa-star absolute -bottom-10 -right-10 text-[12rem] text-white/10 rotate-12 transition-transform duration-1000 group-hover:rotate-45"></i>
                    <h4 className="font-serif font-bold text-2xl mb-6 relative z-10 leading-tight">Beauty Statement</h4>
                    <p className="text-lg leading-relaxed font-light italic relative z-10">"Kecantikan dimulai saat Anda memutuskan untuk menjadi diri sendiri. Jadikan wajahmu adalah kanvas keajaiban dunia."</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white py-12 border-t border-slate-100">
         <div className="container mx-auto px-8 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] leading-none">&copy; 2024 InviteWeb AI Face Laboratory. Premium Aesthetic Analysis Edition.</p>
         </div>
      </footer>
    </div>
  );
};

export default FaceLab;
