
export type UserRole = 'user' | 'admin' | 'manager' | 'tailor' | 'sales man';
export type SleeveType = 'full' | 'half' | 'none';
export type Sex = 'male' | 'female' | 'other';
export type OrderStatus = 'pending' | 'approved' | 'denied' | 'in_progress' | 'completed';

export interface User {
  id: string;
  email: string;
  mobile?: string;
  password?: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  approved: boolean;
}

export interface Fabric {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Design {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Measurements {
  designFor: string;
  age: number;
  sex: Sex;
  height: number;
  shoulder: number;
  chest: number;
  waist: number;
  dressLength: number;
  sleeveType: SleeveType;
  handRound: number;
  handLength: number;
}

export interface StatusUpdate {
  message: string;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  measurements: Measurements;
  selectedFabrics: Fabric[];
  selectedDesign: Design;
  generatedDesigns: string[];
  finalChoiceUrl?: string;
  status: OrderStatus;
  createdAt: string;
  statusUpdates: StatusUpdate[];
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string; // userId or 'all_users'
  text: string;
  timestamp: string;
  orderId?: string;
}

export interface Feedback {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface AppSettings {
  logo: string;
  appName: string;
  helpline: string;
  copyright: string;
  upiId: string;
  qrCodeUrl: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}
