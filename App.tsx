
import React, { useState, useEffect } from 'react';
import { User, Invitation } from './types';
import { storage } from './storage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import CreateInvitation from './components/CreateInvitation';
import PublicInvitationView from './components/PublicInvitationView';
import FashionLab from './components/FashionLab';
import FaceLab from './components/FaceLab';
import Shop from './components/Shop';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeInvitationId, setActiveInvitationId] = useState<string | undefined>();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/invite/')) {
        const id = hash.replace('#/invite/', '');
        setActiveInvitationId(id);
        setCurrentView('invite-view');
      } else if (hash === '#/login') {
        setCurrentView('login');
      } else if (hash === '#/register') {
        setCurrentView('register');
      } else if (hash === '#/dashboard' && currentUser) {
        setCurrentView('dashboard');
      } else if (hash === '#/create' && currentUser) {
        setCurrentView('create');
      } else if (hash === '#/fashion-lab' && currentUser) {
        setCurrentView('fashion-lab');
      } else if (hash === '#/face-lab' && currentUser) {
        setCurrentView('face-lab');
      } else if (hash === '#/shop' && currentUser) {
        setCurrentView('shop');
      } else if (hash === '#/cart' && currentUser) {
        setCurrentView('cart');
      } else if (hash === '#/checkout' && currentUser) {
        setCurrentView('checkout');
      } else if (hash === '#/orders' && currentUser) {
        setCurrentView('orders');
      } else if (hash === '#/admin' && currentUser && currentUser.role === 'admin') {
        setCurrentView('admin');
      } else {
        if (currentUser && hash === '') {
            window.location.hash = '#/dashboard';
        } else {
            setCurrentView('landing');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  const handleLogin = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    navigate('#/dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    navigate('#/login');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentView === 'login' && <LoginPage onLogin={handleLogin} onNavigate={navigate} />}
      {currentView === 'register' && <RegisterPage onNavigate={navigate} />}
      {currentView === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} onNavigate={navigate} />
      )}
      {currentView === 'create' && currentUser && (
        <CreateInvitation user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'invite-view' && activeInvitationId && (
        <PublicInvitationView invitationId={activeInvitationId} onNavigate={navigate} />
      )}
      {currentView === 'fashion-lab' && currentUser && (
        <FashionLab user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'face-lab' && currentUser && (
        <FaceLab user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'shop' && currentUser && (
        <Shop user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'cart' && currentUser && (
        <Cart user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'checkout' && currentUser && (
        <Checkout user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'orders' && currentUser && (
        <OrderHistory user={currentUser} onNavigate={navigate} />
      )}
      {currentView === 'admin' && currentUser && currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onNavigate={navigate} />
      )}
    </div>
  );
};

export default App;
