
import React, { useState, useEffect, useRef } from 'react';
import { User, Product, ProductCategory, Order, UserRole, OrderStatus } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const AdminDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'stats' | 'users' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State for Product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Fashion' as ProductCategory,
    stock: '',
    image: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = () => {
      setProducts(storage.getProducts());
      setOrders(storage.getOrders());
      setUsers(storage.getUsers());
    };
    loadData();
  }, [activeTab]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      stock: Number(formData.stock),
      image: formData.image
    };

    if (editingProduct) {
      storage.updateProduct({ ...editingProduct, ...productData });
      alert("Produk berhasil diperbarui!");
    } else {
      if (!formData.image) return alert("Mohon upload foto produk.");
      const newProd: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...productData,
        soldCount: 0,
        createdAt: new Date().toISOString()
      };
      storage.addProduct(newProd);
      alert("Produk berhasil ditambahkan!");
    }
    
    setFormData({ name: '', price: '', description: '', category: 'Fashion', stock: '', image: '' });
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user.id || userId === 'admin-static') {
      alert("Anda tidak bisa menghapus akun admin utama.");
      return;
    }
    if (confirm("Hapus pengguna ini secara permanen dari sistem?")) {
      storage.deleteUser(userId);
      setUsers(storage.getUsers());
    }
  };

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
    totalSold: orders.reduce((acc, curr) => acc + curr.items.reduce((sum, i) => sum + i.amount, 0), 0),
    topProduct: products.length > 0 ? [...products].sort((a,b) => b.soldCount - a.soldCount)[0] : null
  };

  const tabs = [
    { id: 'products', label: 'Inventory', icon: 'fa-boxes-stacked' },
    { id: 'orders', label: 'Sales Monitor', icon: 'fa-receipt' },
    { id: 'users', label: 'User List', icon: 'fa-users' },
    { id: 'stats', label: 'Analytics', icon: 'fa-chart-line' },
    { id: 'add', label: editingProduct ? 'Edit Item' : 'Create Item', icon: 'fa-plus' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-outfit">
      <header className="bg-slate-900 text-white pb-4 sticky top-0 z-50 shadow-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg shadow-gold/20">
              <i className="fas fa-user-shield text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tighter text-gold leading-none uppercase">Admin Pro Studio</h1>
              <span className="text-[7px] uppercase tracking-[0.4em] text-white/40 font-bold">InviteWeb Global Management</span>
            </div>
          </div>
          <button onClick={() => onNavigate('#/dashboard')} className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold transition flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Dashboard User
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 md:gap-10 mb-16 border-b border-slate-200">
           {tabs.map((t) => (
             <button
               key={t.id}
               onClick={() => { setActiveTab(t.id as any); if (t.id !== 'add') setEditingProduct(null); }}
               className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-3 ${activeTab === t.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <i className={`fas ${t.icon} text-xs ${activeTab === t.id ? 'text-gold' : ''}`}></i>
               {t.label}
               {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-full"></div>}
             </button>
           ))}
        </div>

        {/* INVENTORY TAB */}
        {activeTab === 'products' && (
          <div className="animate-fade-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {products.map(p => (
               <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group">
                  <div className="h-48 bg-slate-50 relative overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                    <span className="absolute top-4 right-4 bg-slate-900/80 text-gold text-[7px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{p.category}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                     <h3 className="font-serif font-bold text-slate-900 text-lg mb-1 truncate">{p.name}</h3>
                     <p className="text-xl font-black text-slate-900 mb-6">Rp {p.price.toLocaleString()}</p>
                     <div className="mt-auto space-y-4">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                           <span>Stok: {p.stock}</span>
                           <span>Sales: {p.soldCount}</span>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setEditingProduct(p); setFormData({ name: p.name, price: p.price.toString(), description: p.description, category: p.category, stock: p.stock.toString(), image: p.image }); setActiveTab('add'); }} className="flex-1 bg-slate-50 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-gold hover:bg-gold/5 transition">Edit</button>
                           <button onClick={() => { if(confirm("Hapus item ini?")) storage.deleteProduct(p.id); setProducts(storage.getProducts()); }} className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash-alt"></i></button>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* GLOBAL ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 animate-fade-up">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                         <th className="pb-6 px-4">Order ID</th>
                         <th className="pb-6 px-4">Customer</th>
                         <th className="pb-6 px-4">Total Amount</th>
                         <th className="pb-6 px-4">Status</th>
                         <th className="pb-6 px-4">Address Snapshot</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm font-medium text-slate-600">
                      {orders.slice().reverse().map(order => (
                        <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                           <td className="py-6 px-4 font-mono text-[10px] font-bold">#{order.id.toUpperCase()}</td>
                           <td className="py-6 px-4">
                              <p className="text-slate-900 font-bold">{order.userName}</p>
                              <p className="text-[8px] opacity-40 uppercase tracking-widest">{order.paymentMethod}</p>
                           </td>
                           <td className="py-6 px-4 font-black text-slate-900">Rp {order.totalPrice.toLocaleString()}</td>
                           <td className="py-6 px-4">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${order.status === 'pending' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                                {order.status}
                              </span>
                           </td>
                           <td className="py-6 px-4 text-[10px] opacity-60 italic truncate max-w-xs">{order.shippingAddress}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* USER LIST TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 animate-fade-up">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map(u => (
                  <div key={u.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden group">
                     <div className="flex items-center gap-6 mb-8">
                        <img src={`https://ui-avatars.com/api/?name=${u.name}&background=D4AF37&color=fff&size=100&bold=true`} className="w-16 h-16 rounded-full border-2 border-white shadow-xl" />
                        <div>
                           <h4 className="font-bold text-slate-900 truncate w-40">{u.name}</h4>
                           <p className="text-xs text-slate-400 truncate w-40">{u.email}</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center bg-white p-4 rounded-2xl mb-6 shadow-inner">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Account Status</span>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-400">
                           {u.role}
                        </span>
                     </div>
                     <button 
                        onClick={() => handleDeleteUser(u.id)} 
                        className="w-full bg-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition shadow-sm border border-red-50 flex items-center justify-center gap-3"
                      >
                        <i className="fas fa-user-slash text-xs"></i> Hapus Member
                      </button>
                  </div>
                ))}
             </div>
             {users.length === 0 && (
               <div className="py-20 text-center opacity-30 uppercase tracking-[0.5em] text-xs font-black">
                  Belum ada member terdaftar
               </div>
             )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'stats' && (
          <div className="animate-fade-up space-y-12">
             <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Total Global Revenue</p>
                   <h4 className="text-4xl font-black text-slate-900">Rp {stats.totalRevenue.toLocaleString()}</h4>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Items Sold Worldwide</p>
                   <h4 className="text-4xl font-black text-slate-900">{stats.totalSold} Units</h4>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Global Star Product</p>
                   <h4 className="text-xl font-serif font-bold text-gold truncate">{stats.topProduct?.name || 'N/A'}</h4>
                </div>
             </div>
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl animate-fade-up max-w-4xl mx-auto border border-slate-50">
             <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12 flex items-center gap-4">
                <i className={`fas ${editingProduct ? 'fa-pen-to-square' : 'fa-plus'} text-gold`}></i>
                {editingProduct ? 'Update Inventory' : 'Add New Item'}
             </h2>
             <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-12">
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-gold transition group shadow-inner">
                   {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="text-center"><i className="fas fa-camera text-slate-300 text-3xl mb-4"></i><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Upload Frame</p></div>}
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                </div>
                <div className="space-y-6">
                   <input required placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold outline-none transition font-bold shadow-inner" />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Price (Rp)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold outline-none transition font-black shadow-inner" />
                      <input type="number" placeholder="Initial Stock" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold outline-none transition font-black shadow-inner" />
                   </div>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold outline-none transition font-bold cursor-pointer shadow-inner">
                      <option value="Fashion">Fashion & Apparel</option>
                      <option value="Aksesori">Luxury Accessories</option>
                      <option value="Makeup">Makeup & Cosmetic</option>
                      <option value="Skincare">Skincare & Health</option>
                   </select>
                   <textarea required rows={4} placeholder="Product Narrative" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold outline-none transition resize-none font-medium text-slate-600 shadow-inner" />
                   <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-gold transition active:scale-95">{editingProduct ? 'Save Inventory Update' : 'Publish Product'}</button>
                </div>
             </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
