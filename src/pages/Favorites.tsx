import React, { useState, useEffect } from 'react';
import { ItemCard } from '../components/ItemCard';
import { FavoriteService, ItemService } from '../services/api';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const itemService = new ItemService();

export default function Favorites() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = () => {
    if (!user) return;
    const favoriteIds = FavoriteService.getAll(user.id);
    const allItems = itemService.getAll();
    const favoriteItems = allItems.filter(item => favoriteIds.includes(item.id));
    setItems(favoriteItems);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Your Favorites</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {items.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onFavoriteToggle={loadFavorites}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 max-w-xs">
              Tap the heart icon on any item to save it for later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
