
import React, { useState, useEffect } from 'react';
import { Invitation, RSVP } from '../types';
import { storage } from '../storage';

interface Props {
  invitationId: string;
  onNavigate: (to: string) => void;
}

const PublicInvitationView: React.FC<Props> = ({ invitationId, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isRsvped, setIsRsvped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOwner, setIsOwner] = useState(false);
  
  const [rsvpData, setRsvpData] = useState({
    guestName: '',
    guestEmail: '',
    status: 'hadir' as 'hadir' | 'tidak',
    message: ''
  });

  useEffect(() => {
    const inv = storage.getInvitations().find(i => i.id === invitationId);
    if (inv) {
      setInvitation(inv);
      setRsvps(storage.getRSVPs().filter(r => r.invitationId === invitationId));
      
      // Check if current user is owner
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === inv.userId) {
        setIsOwner(true);
      }

      const timer = setInterval(() => {
        const eventDate = new Date(`${inv.eventDate}T${inv.eventTime}`).getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [invitationId]);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    const newRsvp: RSVP = {
      id: Math.random().toString(36).substr(2, 9),
      invitationId: invitation.id,
      guestName: rsvpData.guestName,
      guestEmail: rsvpData.guestEmail,
      status: rsvpData.status,
      message: rsvpData.message,
      createdAt: new Date().toISOString()
    };
    storage.addRSVP(newRsvp);
    setRsvps([newRsvp, ...rsvps]);
    setIsRsvped(true);

    const phoneNumber = invitation.rsvpPhone || "6285782559412"; // Use dynamic phone
    const statusText = rsvpData.status === 'hadir' ? 'bersedia hadir' : 'belum bisa hadir';
    const waMessage = `Halo, saya ${rsvpData.guestName} mengonfirmasi bahwa saya ${statusText} untuk acara "${invitation.eventName}".\nPesan: ${rsvpData.message || '-'}`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
    
    window.open(waUrl, '_blank');
  };

  if (!invitation) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-6 text-center">
      <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-serif text-slate-800 text-xl italic">Mempersiapkan Undangan Eksklusif Anda...</p>
    </div>
  );

  const themes = {
    wedding: {
      bg: 'bg-[#000000]',
      pattern: 'opacity-5 absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/black-paper.png")]',
      card: 'bg-[#0a0a0a] border-x border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)]',
      accent: 'text-[#D4AF37]',
      accentBg: 'bg-[#D4AF37]',
      fontTitle: 'font-script',
      imgStyle: 'w-full aspect-[3/4] object-cover rounded-[2.5rem]',
    },
    birthday: {
      bg: 'bg-[#f8faff]',
      pattern: 'opacity-5 absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/circles.png")]',
      card: 'bg-white shadow-2xl text-slate-800',
      accent: 'text-[#6c7aff]',
      accentBg: 'bg-[#6c7aff]',
      fontTitle: 'font-cursive',
      imgStyle: 'w-56 h-56 object-cover rounded-full border-[10px] border-white shadow-2xl mx-auto'
    },
    tahlilan: {
      bg: 'bg-[#0a4a3c]',
      pattern: 'islamic-pattern absolute inset-0 opacity-10 pointer-events-none',
      card: 'bg-transparent text-white',
      accent: 'text-[#D4AF37]',
      accentBg: 'bg-[#D4AF37]',
      fontTitle: 'font-cinzel',
      imgStyle: 'w-48 h-48 object-cover rounded-full border-4 border-[#D4AF37] shadow-xl mx-auto',
    },
    costume: {
      bg: 'bg-[#8c8216]', 
      pattern: 'opacity-10 absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/pinstripe-light.png")]',
      card: 'bg-white shadow-2xl',
      accent: 'text-[#8c8216]',
      accentBg: 'bg-[#B59449]', 
      fontTitle: 'font-serif',
      imgStyle: 'w-full aspect-square object-cover rounded-[3rem] border-4 border-white shadow-xl'
    }
  };

  const theme = themes[invitation.eventType] || themes.wedding;
  const mainImg = invitation.photos?.[0] || 'https://images.unsplash.com/photo-1512389055488-8d82cb26ba6c?q=80&w=1000&auto=format&fit=crop';

  if (!isOpen) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme.bg} relative overflow-hidden font-quicksand`}>
        {isOwner && (
          <button 
            onClick={() => onNavigate('#/dashboard')} 
            className="absolute top-8 left-8 z-50 bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl"
          >
            <i className="fas fa-arrow-left mr-2"></i> Dashboard
          </button>
        )}
        <div className={theme.pattern}></div>
        <div className="max-w-md w-full text-center z-10 animate-fade-up">
          <div className={`${invitation.eventType === 'wedding' ? 'bg-[#111111]/90' : (invitation.eventType === 'tahlilan' ? 'bg-[#0a4a3c]/90' : (invitation.eventType === 'birthday' ? 'bg-white/95 shadow-2xl rounded-[3.5rem]' : (invitation.eventType === 'costume' ? 'bg-white/95 border border-white/20 rounded-[3rem] p-10' : 'bg-white/90')))} backdrop-blur-xl p-10 md:p-14`}>
            {invitation.eventType === 'tahlilan' && <p className="text-[#D4AF37] font-arabic text-3xl mb-6">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>}
            
            <div className="mb-10 relative inline-block">
                <img src={mainImg} className={`${invitation.eventType === 'tahlilan' || invitation.eventType === 'birthday' ? 'w-48 h-48 rounded-full' : (invitation.eventType === 'costume' ? 'w-52 h-52 rounded-full border-4 border-white' : 'w-52 h-72 rounded-[2.5rem]')} object-cover mx-auto shadow-2xl`} alt="Cover" />
                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 ${theme.accentBg} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                  <i className={`fas ${invitation.eventType === 'birthday' ? 'fa-birthday-cake' : (invitation.eventType === 'wedding' ? 'fa-heart' : (invitation.eventType === 'costume' ? 'fa-star' : 'fa-envelope'))} text-white`}></i>
                </div>
            </div>
            
            <p className={`${invitation.eventType === 'birthday' ? 'text-[#6c7aff] font-cursive' : (invitation.eventType === 'costume' ? 'text-slate-400 font-bold' : 'text-white/50')} mb-4 uppercase tracking-[0.2em] text-[10px]`}>Kepada Tamu Istimewa,</p>
            <h2 className={`text-3xl md:text-4xl ${theme.fontTitle} ${theme.accent} mb-8 leading-tight tracking-wider font-bold`}>{invitation.eventName}</h2>
            
            <button 
              onClick={() => setIsOpen(true)}
              className={`${theme.accentBg} text-white w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition transform active:scale-95 mt-4`}
            >
              <i className="fas fa-envelope-open mr-2"></i> BUKA UNDANGAN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SHARED LAYOUT FOR ALL TEMPLATES
  return (
    <div className={`min-h-screen py-10 md:py-20 px-4 ${theme.bg} relative overflow-x-hidden transition-colors duration-700 font-quicksand`}>
      {isOwner && (
        <button 
          onClick={() => onNavigate('#/dashboard')} 
          className="fixed top-8 left-8 z-50 bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl"
        >
          <i className="fas fa-arrow-left mr-2"></i> Dashboard
        </button>
      )}
      <div className={theme.pattern}></div>
      <div className={`max-w-xl mx-auto rounded-[3rem] overflow-hidden relative z-10 animate-fade-up ${theme.card}`}>
        
        {/* Header Photo */}
        <div className="p-8 md:p-12 text-center">
            <img src={mainImg} className={theme.imgStyle} alt="Invitation Image" />
            
            {invitation.eventType === 'tahlilan' && <p className="font-arabic text-4xl text-[#D4AF37] my-8">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>}
            
            <h1 className={`text-4xl md:text-6xl ${theme.fontTitle} ${theme.accent} my-10 font-bold leading-tight`}>{invitation.eventName}</h1>
            <p className={`italic mb-12 px-6 leading-relaxed ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-slate-400' : 'text-slate-600'}`}>"{invitation.eventMessage}"</p>
            
            {/* Countdown for Events */}
            {invitation.eventType !== 'tahlilan' && (
              <div className="grid grid-cols-4 gap-4 mb-16 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                 {[{v:timeLeft.days, l:'HARI'}, {v:timeLeft.hours, l:'JAM'}, {v:timeLeft.minutes, l:'MENIT'}, {v:timeLeft.seconds, l:'DETIK'}].map(t => (
                   <div key={t.l}><p className={`text-2xl font-black ${theme.accent}`}>{t.v}</p><p className="text-[8px] font-black text-slate-400 tracking-widest">{t.l}</p></div>
                 ))}
              </div>
            )}

            {/* Event Details */}
            <div className={`text-left p-10 rounded-[2.5rem] mb-16 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'bg-white/5 border border-white/10' : 'bg-[#FDFBF7] border border-slate-100'}`}>
               <h4 className={`${theme.accent} font-serif text-2xl mb-8 flex items-center gap-4`}>
                 <i className="fas fa-calendar-check opacity-30"></i> Detail Acara
               </h4>
               <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-2xl ${theme.accentBg} bg-opacity-10 flex items-center justify-center shrink-0`}>
                      <i className={`fas fa-calendar-day ${theme.accent}`}></i>
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white/40' : 'text-slate-400'}`}>Tanggal</p>
                      <p className={`text-xl font-bold ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white' : 'text-slate-800'}`}>{invitation.eventDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-2xl ${theme.accentBg} bg-opacity-10 flex items-center justify-center shrink-0`}>
                      <i className={`fas fa-clock ${theme.accent}`}></i>
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white/40' : 'text-slate-400'}`}>Waktu</p>
                      <p className={`text-xl font-bold ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white' : 'text-slate-800'}`}>{invitation.eventTime} WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-2xl ${theme.accentBg} bg-opacity-10 flex items-center justify-center shrink-0`}>
                      <i className={`fas fa-location-dot ${theme.accent}`}></i>
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white/40' : 'text-slate-400'}`}>Lokasi</p>
                      <p className={`text-lg font-bold leading-relaxed ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white' : 'text-slate-800'}`}>{invitation.eventLocation}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* RSVP Form */}
            {!isRsvped ? (
              <div className={`p-10 rounded-[2.5rem] ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'bg-white/5' : 'bg-slate-50 shadow-inner'}`}>
                <h4 className={`text-xl font-bold mb-8 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white' : 'text-slate-800'}`}>Konfirmasi Kehadiran</h4>
                <form onSubmit={handleRSVP} className="space-y-5">
                  <input 
                    placeholder="Nama Anda" 
                    required 
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none shadow-sm text-slate-800 font-medium" 
                    value={rsvpData.guestName} 
                    onChange={(e) => setRsvpData({...rsvpData, guestName: e.target.value})} 
                  />
                  <textarea 
                    placeholder="Pesan / Doa" 
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none shadow-sm text-slate-800 h-32 resize-none" 
                    value={rsvpData.message} 
                    onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})} 
                  />
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setRsvpData({...rsvpData, status: 'hadir'})}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all ${rsvpData.status === 'hadir' ? theme.accentBg + ' text-white' : 'bg-white text-slate-400'}`}
                    >
                      Hadir
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRsvpData({...rsvpData, status: 'tidak'})}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all ${rsvpData.status === 'tidak' ? 'bg-red-500 text-white' : 'bg-white text-slate-400'}`}
                    >
                      Berhalangan
                    </button>
                  </div>
                  <button type="submit" className={`w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl mt-6 ${theme.accentBg}`}>
                    Kirim Konfirmasi via WA
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-10 bg-green-50 rounded-[2.5rem] border border-green-100 animate-bounce">
                <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                <p className="text-green-800 font-bold">Terima kasih atas konfirmasinya!</p>
              </div>
            )}

            {/* Guest Book / Messages */}
            <div className="mt-20 text-left">
              <h4 className={`text-xs font-black uppercase tracking-[0.3em] mb-10 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white/30' : 'text-slate-300'}`}>Pesan Tamu ({rsvps.length})</h4>
              <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {rsvps.map(r => (
                  <div key={r.id} className={`p-6 rounded-3xl ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'bg-white/5 border border-white/10' : 'bg-white shadow-sm border border-slate-50'}`}>
                    <p className={`font-bold mb-2 ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-gold' : theme.accent}`}>{r.guestName}</p>
                    <p className={`text-sm leading-relaxed ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-slate-400' : 'text-slate-500'}`}>{r.message}</p>
                    <p className="text-[8px] text-slate-500 mt-4 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 opacity-30">
               <p className={`text-[8px] uppercase tracking-[1em] ${invitation.eventType === 'wedding' || invitation.eventType === 'tahlilan' ? 'text-white' : 'text-slate-900'}`}>InviteWeb Pro</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInvitationView;
