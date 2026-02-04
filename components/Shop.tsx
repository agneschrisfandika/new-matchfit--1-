
import React, { useState, useEffect } from 'react';
import { User, Product, ProductCategory } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const Shop: React.FC<Props> = ({ user, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const data = storage.getProducts();
    setProducts(data);
    setFilteredProducts(selectedCategory === 'All' ? data : data.filter(p => p.category === selectedCategory));
    setCartCount(storage.getCart(user.id).reduce((acc, item) => acc + item.amount, 0));
  }, [selectedCategory, user.id]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Maaf, stok item ini telah habis.");
      return;
    }

    storage.addToCart(user.id, product);
    setAddedItems(prev => new Set(prev).add(product.id));
    setCartCount(prev => prev + 1);
    
    // Clear feedback after 1.5s
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const categories: (ProductCategory | 'All')[] = ['All', 'Fashion', 'Aksesori', 'Makeup', 'Skincare'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-outfit">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('#/dashboard')}>
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-gold/20">
              <i className="fas fa-shopping-bag text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tighter text-gold leading-none uppercase">Fashion Shop</h1>
              <span className="text-[7px] uppercase tracking-[0.4em] text-white/40 font-bold">Exclusive Pro Collection</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('#/cart')}
              className="relative bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:border-gold transition flex items-center gap-3"
            >
              <i className="fas fa-shopping-cart text-xs"></i>
              Keranjang ({cartCount})
            </button>
            <button 
              onClick={() => onNavigate('#/dashboard')} 
              className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold transition flex items-center gap-2 group"
            >
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20 animate-fade-up">
           <span className="text-gold font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Personal Curation</span>
           <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tighter leading-tight">Lengkapi Gayamu Dengan<br/><span className="text-gold italic">Koleksi Terpilih.</span></h2>
           <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-light text-lg">Dapatkan kurasi item fashion, aksesori, dan kecantikan eksklusif yang dirancang khusus untuk meningkatkan rasa percaya diri Anda.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-16 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all border shadow-sm ${
                selectedCategory === cat 
                ? 'bg-slate-900 text-gold border-slate-900 shadow-xl -translate-y-1' 
                : 'bg-white text-slate-400 hover:text-slate-900 border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="animate-fade-up">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group flex flex-col h-full relative">
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-gold text-[8px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-xl">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif group-hover:text-gold transition-colors leading-tight">{product.name}</h3>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Rp {product.price.toLocaleString()}</p>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span>Tersedia: <span className={product.stock < 5 ? 'text-red-500' : 'text-slate-900'}>{product.stock} Unit</span></span>
                         <span>Terjual: {product.soldCount}+</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                          addedItems.has(product.id) 
                          ? 'bg-green-500 text-white' 
                          : product.stock <= 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-gold'
                        }`}
                      >
                        {addedItems.has(product.id) ? (
                          <><i className="fas fa-check"></i> Masuk Keranjang</>
                        ) : product.stock <= 0 ? (
                          'Stok Habis'
                        ) : (
                          <><i className="fas fa-cart-plus"></i> Tambah ke Keranjang</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-box-open text-3xl text-slate-200"></i>
              </div>
              <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-xs">Belum ada koleksi di kategori ini</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
