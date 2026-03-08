export interface SustainabilityStats {
  waterSaved: number; // liters
  wasteSaved: number; // kg
  co2Saved: number; // kg
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  location: string;
  profileImage: string;
  rating: number;
  bio?: string;
  verifiedSeller: boolean;
  salesCount: number;
  sustainabilityStats?: SustainabilityStats;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  size: string;
  condition: string;
  color: string;
  images: string[];
  sellerId: string;
  location: string;
  status: "available" | "sold";
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  itemId: string;
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  deliveryMethod: "delivery" | "collection";
  deliveryAddress: string;
  status: "pending" | "shipped" | "completed";
  createdAt: string;
}

export interface Favorite {
  userId: string;
  itemId: string;
}

export interface Offer {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  offerPrice: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
