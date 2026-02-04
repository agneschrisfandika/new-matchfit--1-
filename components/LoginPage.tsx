
import React, { useState } from 'react';
import { User } from '../types';
import { storage, hashPassword } from '../storage';

interface Props {
  onLogin: (user: User) => void;
  onNavigate: (to: string) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState(''); // Holds email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check for hardcoded super-admin credentials
    if (email === 'matchfit' && password === 'matchfit123?!') {
      const adminUser: User = {
        id: 'admin-static',
        name: 'Matchfit Admin',
        email: 'matchfit', // Using the username here for identification
        passwordHash: 'static-access',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      onLogin(adminUser);
      return;
    }

    // 2. Standard user login process from storage
    const users = storage.getUsers();
    // In local storage, we check against the 'email' field
    const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
    
    if (user) {
      onLogin(user);
    } else {
      setError('Email/Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 font-outfit">
      <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl w-full max-w-md animate-fade-up">
        <div className="flex justify-center mb-10">
           <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shadow-xl shadow-gold/20 rotate-3">
              <i className="fas fa-user-lock text-white text-2xl"></i>
           </div>
        </div>
        
        <h1 className="text-3xl font-bold font-serif text-slate-900 text-center mb-2">Member Login</h1>
        <p className="text-center text-slate-400 text-xs uppercase tracking-[0.2em] mb-10 font-bold">Akses Studio Eksklusif Anda</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] mb-8 text-center font-black uppercase tracking-widest border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email atau Username</label>
            <div className="relative">
              <input 
                type="text" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold focus:bg-white transition-all outline-none font-bold text-slate-800 shadow-inner"
                placeholder="email@example.com / username"
              />
              <i className="fas fa-user absolute right-6 top-1/2 -translate-y-1/2 text-slate-200"></i>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold focus:bg-white transition-all outline-none font-bold text-slate-800 shadow-inner"
                placeholder="••••••••"
              />
              <i className="fas fa-lock absolute right-6 top-1/2 -translate-y-1/2 text-slate-200"></i>
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gold transition shadow-xl active:scale-95 transform">
            Masuk Sesi Pro
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-xs">
            Belum punya akun? <button onClick={() => onNavigate('#/register')} className="text-gold font-black uppercase tracking-widest hover:underline ml-2">Daftar Pro</button>
          </p>
          <button onClick={() => onNavigate('#/')} className="mt-6 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition">Kembali ke Beranda</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
