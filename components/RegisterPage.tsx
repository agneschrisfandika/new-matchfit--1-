
import React, { useState } from 'react';
import { User } from '../types';
import { storage, hashPassword } from '../storage';

interface Props {
  onNavigate: (to: string) => void;
}

const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi dasar
    if (formData.password !== formData.confirmPassword) {
      setError('Password konfirmasi tidak cocok');
      return;
    }

    // 1. Proteksi username sistem admin statis
    if (formData.email.toLowerCase() === 'matchfit') {
      setError('Username ini sudah dipesan oleh sistem.');
      return;
    }

    const users = storage.getUsers();
    
    // 2. Cek apakah email sudah terdaftar
    if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('Email/Username sudah digunakan');
      return;
    }

    // 3. Registrasi sebagai USER biasa (Admin diatur via kode/statis)
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      passwordHash: hashPassword(formData.password),
      role: 'user', // Selalu user
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.saveUsers(users);
    alert(`Registrasi Akun Pro berhasil! Silakan login.`);
    onNavigate('#/login');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 font-outfit">
      <div className="bg-white rounded-[3.5rem] p-8 md:p-14 shadow-2xl w-full max-w-md animate-fade-up">
        <div className="flex justify-center mb-10">
           <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-[-3deg]">
              <i className="fas fa-user-plus text-gold text-2xl"></i>
           </div>
        </div>

        <h1 className="text-3xl font-bold font-serif text-slate-900 text-center mb-2">Daftar Akun</h1>
        <p className="text-center text-slate-400 text-xs uppercase tracking-[0.2em] mb-10 font-bold">Mulai Pengalaman Premium Anda</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] mb-8 text-center font-black uppercase tracking-widest border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
            <input 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none font-bold shadow-inner"
              placeholder="E.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email atau Username</label>
            <input 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none font-bold shadow-inner"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required 
              minLength={6}
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none font-bold shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Konfirmasi Password</label>
            <input 
              type="password" 
              required 
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none font-bold shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-gold transition mt-6 active:scale-95 transform">
            Buat Akun Pro
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-xs">
            Sudah punya akun? <button onClick={() => onNavigate('#/login')} className="text-gold font-black uppercase tracking-widest hover:underline ml-2">Masuk Sini</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
