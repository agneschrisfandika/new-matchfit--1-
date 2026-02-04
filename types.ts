
export type EventType = 'wedding' | 'birthday' | 'tahlilan' | 'costume';
export type ProductCategory = 'Fashion' | 'Aksesori' | 'Makeup' | 'Skincare';
export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'shipped' | 'delivered';
export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string; // Base64
  stock: number;
  soldCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  amount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  priceAtPurchase: number;
  amount: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Invitation {
  id: string;
  userId: string;
  eventType: EventType;
  eventName: string;
  organizerName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMessage: string;
  rsvpPhone: string; // Added field
  photos: string[]; 
  createdAt: string;
}

export interface RSVP {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail: string;
  status: 'hadir' | 'tidak';
  attendanceType?: 'sendiri' | 'pasangan';
  message?: string;
  createdAt: string;
}

export interface FashionAnalysis {
  bodyShape: 'Apple' | 'Pear' | 'Hourglass' | 'Rectangle' | 'Inverted Triangle';
  undertone: 'Warm' | 'Cool' | 'Neutral';
  recommendations: string[];
  powerColors: string[];
  makeupPalette: { name: string, hex: string }[]; // Added field
  outfits: {
    occasion: string;
    items: string[];
    reason: string;
  }[];
}

export interface MakeupRecommendation {
  category: string;
  suggestion: string;
  palette: {
    name: string;
    hex: string;
  }[];
  shape?: string; // E.g., 'Cat Eye', 'Arched Brows', 'Straight Brows'
  shadingTechnique?: string; // E.g., 'V-Shape Contour', 'Soft Shadowing'
  applicationTips: string; // Deep guide on how to apply correctly
}

export interface FaceAnalysis {
  skinTone: string;
  undertone: string;
  facialAge: number;
  skinTexture: string;
  acneStatus: string;
  faceShape: string;
  features: {
    eyes: string;
    nose: string;
    mouth: string;
    eyeToBrowDistance: string;
  };
  makeupRecommendations: MakeupRecommendation[];
  skincareRoutine: {
    type: string;
    recommendedIngredients: string[];
    avoidIngredients: string[];
    explanation: string;
  };
  dietaryTips: {
    recommended: string[];
    avoid: string[];
  };
}

export interface AppState {
  currentUser: User | null;
  currentView: 'landing' | 'login' | 'register' | 'dashboard' | 'create' | 'invite-view' | 'fashion-lab' | 'face-lab' | 'shop' | 'admin' | 'cart' | 'checkout' | 'orders';
  activeInvitationId?: string;
}
