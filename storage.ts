
import { User, Invitation, RSVP, Product, Order, CartItem } from './types';

const KEYS = {
  USERS: 'inviteweb_users',
  CURRENT_USER: 'inviteweb_current_user',
  INVITATIONS: 'inviteweb_invitations',
  RSVPS: 'inviteweb_rsvps',
  PRODUCTS: 'inviteweb_products',
  ORDERS: 'inviteweb_orders',
  CART: 'inviteweb_cart_' 
};

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),
  
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
  
  getInvitations: (): Invitation[] => JSON.parse(localStorage.getItem(KEYS.INVITATIONS) || '[]'),
  saveInvitations: (invitations: Invitation[]) => localStorage.setItem(KEYS.INVITATIONS, JSON.stringify(invitations)),
  
  getRSVPs: (): RSVP[] => JSON.parse(localStorage.getItem(KEYS.RSVPS) || '[]'),
  saveRSVPs: (rsvps: RSVP[]) => localStorage.setItem(KEYS.RSVPS, JSON.stringify(rsvps)),

  getProducts: (): Product[] => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]'),
  saveProducts: (products: Product[]) => localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products)),

  getOrders: (): Order[] => JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]'),
  saveOrders: (orders: Order[]) => localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)),

  // Cart Management
  getCart: (userId: string): CartItem[] => JSON.parse(localStorage.getItem(KEYS.CART + userId) || '[]'),
  saveCart: (userId: string, cart: CartItem[]) => localStorage.setItem(KEYS.CART + userId, JSON.stringify(cart)),
  clearCart: (userId: string) => localStorage.removeItem(KEYS.CART + userId),

  addToCart: (userId: string, product: Product) => {
    const cart = storage.getCart(userId);
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      existing.amount += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        amount: 1
      });
    }
    storage.saveCart(userId, cart);
  },

  // Helpers
  addInvitation: (inv: Invitation) => {
    const invs = storage.getInvitations();
    invs.push(inv);
    storage.saveInvitations(invs);
  },
  
  deleteInvitation: (id: string) => {
    const invs = storage.getInvitations().filter(i => i.id !== id);
    const rsvps = storage.getRSVPs().filter(r => r.invitationId !== id);
    storage.saveInvitations(invs);
    storage.saveRSVPs(rsvps);
  },

  addRSVP: (rsvp: RSVP) => {
    const rsvps = storage.getRSVPs();
    rsvps.push(rsvp);
    storage.saveRSVPs(rsvps);
  },

  addProduct: (product: Product) => {
    const products = storage.getProducts();
    products.push(product);
    storage.saveProducts(products);
  },

  updateProduct: (updatedProduct: Product) => {
    const products = storage.getProducts().map(p => p.id === updatedProduct.id ? updatedProduct : p);
    storage.saveProducts(products);
  },

  deleteProduct: (id: string) => {
    const products = storage.getProducts().filter(p => p.id !== id);
    storage.saveProducts(products);
  },

  deleteUser: (userId: string) => {
    const users = storage.getUsers().filter(u => u.id !== userId);
    storage.saveUsers(users);
  },

  addOrder: (order: Order) => {
    const orders = storage.getOrders();
    orders.push(order);
    storage.saveOrders(orders);
    
    // Update global stock and sales count
    const products = storage.getProducts();
    order.items.forEach(orderItem => {
      const pIndex = products.findIndex(p => p.id === orderItem.productId);
      if (pIndex !== -1) {
        products[pIndex].stock = Math.max(0, products[pIndex].stock - orderItem.amount);
        products[pIndex].soldCount += orderItem.amount;
      }
    });
    storage.saveProducts(products);
  }
};

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
