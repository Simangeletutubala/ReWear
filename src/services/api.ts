import { User, Item, Message, Order, Favorite, Offer } from '../types';
import { generateId } from '../utils/helpers';

const STORAGE_KEYS = {
  USERS: 'rewear_users',
  ITEMS: 'rewear_items',
  MESSAGES: 'rewear_messages',
  ORDERS: 'rewear_orders',
  FAVORITES: 'rewear_favorites',
  OFFERS: 'rewear_offers',
  CURRENT_USER: 'rewear_current_user'
};

class BaseService<T extends { id: string }> {
  protected key: string;

  constructor(key: string) {
    this.key = key;
  }

  protected getItems(): T[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  protected saveItems(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  getAll(): T[] {
    return this.getItems();
  }

  getById(id: string): T | undefined {
    return this.getItems().find(item => item.id === id);
  }

  create(item: Omit<T, 'id'>): T {
    const newItem = { ...item, id: generateId() } as T;
    const items = this.getItems();
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    items[index] = { ...items[index], ...updates };
    this.saveItems(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.saveItems(filtered);
    return true;
  }
}

export const UserService = {
  getAll: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[],
  getById: (id: string) => (JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[]).find(u => u.id === id),
  create: (user: User) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as User[];
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  },
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) as User : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};

export class ItemService extends BaseService<Item> {
  constructor() {
    super(STORAGE_KEYS.ITEMS);
  }
  
  getBySeller(sellerId: string): Item[] {
    return this.getAll().filter(item => item.sellerId === sellerId);
  }

  getByLocation(location: string): Item[] {
    return this.getItems().filter(item => 
      item.location.toLowerCase() === location.toLowerCase() && 
      item.status === 'available'
    );
  }

  getNearbyItems(location: string, includeNearby: boolean = false): Item[] {
    const allItems = this.getItems().filter(item => item.status === 'available');
    
    if (!includeNearby) {
      return allItems.filter(item => item.location.toLowerCase() === location.toLowerCase());
    }

    // Mock nearby cities logic for South Africa
    const nearbyMap: Record<string, string[]> = {
      'Cape Town, SA': ['Stellenbosch, SA', 'Paarl, SA', 'Somerset West, SA', 'Durbanville, SA'],
      'Johannesburg, SA': ['Pretoria, SA', 'Sandton, SA', 'Midrand, SA', 'Soweto, SA'],
      'Pretoria, SA': ['Johannesburg, SA', 'Centurion, SA', 'Midrand, SA'],
      'Durban, SA': ['Umhlanga, SA', 'Ballito, SA', 'Pinetown, SA'],
      'Stellenbosch, SA': ['Cape Town, SA', 'Paarl, SA', 'Somerset West, SA'],
      'Sandton, SA': ['Johannesburg, SA', 'Pretoria, SA', 'Midrand, SA'],
      'Gqeberha, SA': ['Uitenhage, SA', 'Port Elizabeth, SA'],
      'Bloemfontein, SA': ['Welkom, SA']
    };

    const nearbyCities = nearbyMap[location] || [];
    
    return allItems.filter(item => 
      item.location.toLowerCase() === location.toLowerCase() || 
      nearbyCities.some(city => item.location.toLowerCase() === city.toLowerCase())
    );
  }

  getOutfitSuggestions(currentItem: Item): Item[] {
    const allItems = this.getAll().filter(i => i.id !== currentItem.id && i.status === 'available');
    
    const outfitCategories: Record<string, string[]> = {
      'Jackets': ['Jeans', 'Shoes', 'Tops', 'Bags'],
      'Tops': ['Jeans', 'Shoes', 'Jackets', 'Accessories'],
      'Jeans': ['Tops', 'Shoes', 'Jackets', 'Bags'],
      'Dresses': ['Shoes', 'Bags', 'Accessories', 'Jackets'],
      'Shoes': ['Jeans', 'Dresses', 'Tops', 'Bags'],
      'Bags': ['Dresses', 'Shoes', 'Jackets', 'Accessories'],
      'Accessories': ['Tops', 'Dresses', 'Jackets', 'Bags']
    };

    const targetCategories = outfitCategories[currentItem.category] || [];
    
    // Scoring system for better matching
    const scoredItems = allItems.map(item => {
      let score = 0;
      
      // Category match (highest priority)
      if (targetCategories.includes(item.category)) {
        score += 10;
      }
      
      // Color similarity
      if (item.color.toLowerCase() === currentItem.color.toLowerCase()) {
        score += 5;
      } else if (
        (currentItem.color.toLowerCase() === 'black' || currentItem.color.toLowerCase() === 'white') ||
        (item.color.toLowerCase() === 'black' || item.color.toLowerCase() === 'white')
      ) {
        // Black and white go with everything
        score += 2;
      }
      
      // Style matching (based on brand or description keywords)
      const styles = ['vintage', 'streetwear', 'formal', 'casual', 'chic', 'sporty'];
      const currentStyles = styles.filter(s => 
        currentItem.title.toLowerCase().includes(s) || 
        currentItem.description.toLowerCase().includes(s)
      );
      
      const itemStyles = styles.filter(s => 
        item.title.toLowerCase().includes(s) || 
        item.description.toLowerCase().includes(s)
      );
      
      const matchingStyles = currentStyles.filter(s => itemStyles.includes(s));
      score += matchingStyles.length * 3;

      // Brand matching
      if (item.brand === currentItem.brand) {
        score += 2;
      }

      return { item, score };
    });

    // Filter items that have at least some category relevance or high style/color match
    return scoredItems
      .filter(si => si.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(si => si.item)
      .slice(0, 4);
  }

  search(query: string, filters?: any): Item[] {
    let items = this.getAll().filter(i => i.status === 'available');
    
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q)
      );
    }

    if (filters) {
      if (filters.category) items = items.filter(i => i.category === filters.category);
      if (filters.condition) items = items.filter(i => i.condition === filters.condition);
      if (filters.minPrice) items = items.filter(i => i.price >= filters.minPrice);
      if (filters.maxPrice) items = items.filter(i => i.price <= filters.maxPrice);
      if (filters.size) items = items.filter(i => i.size === filters.size);
    }

    return items;
  }
}

export class MessageService extends BaseService<Message> {
  constructor() {
    super(STORAGE_KEYS.MESSAGES);
  }

  getConversation(user1Id: string, user2Id: string, itemId: string): Message[] {
    return this.getAll().filter(m => 
      m.itemId === itemId && 
      ((m.senderId === user1Id && m.receiverId === user2Id) || 
       (m.senderId === user2Id && m.receiverId === user1Id))
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getUserConversations(userId: string): { otherUser: User, lastMessage: Message, item: Item }[] {
    const messages = this.getAll().filter(m => m.senderId === userId || m.receiverId === userId);
    const conversationsMap = new Map<string, Message>();

    messages.forEach(m => {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId;
      const key = `${otherId}_${m.itemId}`;
      const existing = conversationsMap.get(key);
      if (!existing || new Date(m.createdAt) > new Date(existing.createdAt)) {
        conversationsMap.set(key, m);
      }
    });

    const itemService = new ItemService();
    const results: any[] = [];

    conversationsMap.forEach((lastMessage, key) => {
      const [otherId, itemId] = key.split('_');
      const otherUser = UserService.getById(otherId);
      const item = itemService.getById(itemId);
      if (otherUser && item) {
        results.push({ otherUser, lastMessage, item });
      }
    });

    return results.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  }
}

export class OrderService extends BaseService<Order> {
  constructor() {
    super(STORAGE_KEYS.ORDERS);
  }

  getByUser(userId: string): Order[] {
    return this.getAll().filter(o => o.buyerId === userId || o.sellerId === userId);
  }

  createWithStats(orderData: Omit<Order, 'id'>): Order {
    const order = this.create(orderData);
    
    // Update buyer's sustainability stats (as a cache/quick access)
    const users = UserService.getAll();
    const buyerIndex = users.findIndex(u => u.id === order.buyerId);
    
    if (buyerIndex !== -1) {
      const buyer = users[buyerIndex];
      const currentStats = buyer.sustainabilityStats || { waterSaved: 0, wasteSaved: 0, co2Saved: 0 };
      
      buyer.sustainabilityStats = {
        waterSaved: currentStats.waterSaved + 2700,
        wasteSaved: currentStats.wasteSaved + 0.5,
        co2Saved: currentStats.co2Saved + 3,
      };
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      const currentUser = UserService.getCurrentUser();
      if (currentUser && currentUser.id === buyer.id) {
        UserService.setCurrentUser(buyer);
      }
    }
    
    return order;
  }

  completeOrder(orderId: string): Order | undefined {
    const order = this.getById(orderId);
    if (!order) return undefined;

    const updatedOrder = this.update(orderId, { status: 'completed' });
    
    if (updatedOrder) {
      // Update seller's sales count and verification status
      const users = UserService.getAll();
      const sellerIndex = users.findIndex(u => u.id === order.sellerId);
      
      if (sellerIndex !== -1) {
        const seller = users[sellerIndex];
        seller.salesCount = (seller.salesCount || 0) + 1;
        
        if (seller.salesCount >= 5) {
          seller.verifiedSeller = true;
        }
        
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // If the current user is the seller, update their session
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.id === seller.id) {
          UserService.setCurrentUser(seller);
        }
      }
    }
    
    return updatedOrder;
  }
}

export class OfferService extends BaseService<Offer> {
  constructor() {
    super(STORAGE_KEYS.OFFERS);
  }

  getByItem(itemId: string): Offer[] {
    return this.getItems().filter(offer => offer.itemId === itemId);
  }

  getByBuyer(buyerId: string): Offer[] {
    return this.getItems().filter(offer => offer.buyerId === buyerId);
  }

  getBySeller(sellerId: string): Offer[] {
    return this.getItems().filter(offer => offer.sellerId === sellerId);
  }

  updateStatus(offerId: string, status: "accepted" | "rejected"): Offer | undefined {
    return this.update(offerId, { status });
  }
}

export const FavoriteService = {
  getAll: (userId: string) => {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]') as Favorite[];
    return favorites.filter(f => f.userId === userId).map(f => f.itemId);
  },
  toggle: (userId: string, itemId: string) => {
    let favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]') as Favorite[];
    const index = favorites.findIndex(f => f.userId === userId && f.itemId === itemId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ userId, itemId });
    }
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return index === -1; // returns true if added, false if removed
  },
  isFavorite: (userId: string, itemId: string) => {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]') as Favorite[];
    return favorites.some(f => f.userId === userId && f.itemId === itemId);
  }
};
