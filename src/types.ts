import { MenuItem } from './data/restaurantConfig';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
  orderType: OrderType;
  couponCode?: string;
}

export interface TableBooking {
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingPreference: string;
  specialRequests?: string;
}

export interface QuizState {
  diet: 'veg' | 'nonveg' | 'any';
  spice: 1 | 2 | 3;
  groupSize: 'solo' | 'couple' | 'family';
  budget: 'budget' | 'medium' | 'premium';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedItems?: MenuItem[];
}
