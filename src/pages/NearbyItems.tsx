import React, { useState, useEffect } from 'react';
import { ItemCard } from '../components/ItemCard';
import { ItemService } from '../services/api';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/helpers';

const itemService = new ItemService();

type LocationFilter = 'my-city' | 'nearby' | 'all';

export default function NearbyItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<LocationFilter>('my-city');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadItems();
    } else {
      setIsLoading(false);
    }
  }, [user, filter]);

  const loadItems = () => {
    setIsLoading(true);
    if (!user) return;

    let results: Item[] = [];
    if (filter === 'my-city') {
      results = itemService.getNearbyItems(user.location, false);
    } else if (filter === 'nearby') {
      results = itemService.getNearbyItems(user.location, true);
    } else {
      results = itemService.getAll().filter(i => i.status === 'available');
    }

    setItems(results);
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-gray-400" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Login to see nearby items</h2>
        <p className="text-gray-500 mb-6 max-w-xs">We need your location to show you listings in your city.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-full"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Nearby Listings</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> {user.location}
              </p>
            </div>
          </div>

          <div className="relative group">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as LocationFilter)}
              className="appearance-none bg-gray-100 border-none rounded-full pl-4 pr-10 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="my-city">My City</option>
              <option value="nearby">Nearby Cities</option>
              <option value="all">All Locations</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SlidersHorizontal size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items nearby</h3>
            <p className="text-gray-500 max-w-xs">
              Try expanding your search to nearby cities or all locations.
            </p>
            <button 
              onClick={() => setFilter('nearby')}
              className="mt-6 text-emerald-600 font-bold"
            >
              See nearby cities
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
