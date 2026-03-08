import React, { useState, useEffect } from 'react';
import { ItemCard } from '../components/ItemCard';
import { FilterBar } from '../components/Filters';
import { ItemService } from '../services/api';
import { Item } from '../types';
import { seedData } from '../utils/seedData';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const itemService = new ItemService();

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [nearbyItems, setNearbyItems] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    seedData();
    loadItems();
  }, []);

  useEffect(() => {
    if (user) {
      const nearby = itemService.getNearbyItems(user.location, false).slice(0, 6);
      setNearbyItems(nearby);
    }
  }, [user]);

  const loadItems = () => {
    const allItems = itemService.search(query, filters);
    setItems(allItems);
  };

  useEffect(() => {
    loadItems();
  }, [query, filters]);

  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <FilterBar 
        onSearch={setQuery} 
        onFilterChange={setFilters} 
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Nearby Section */}
        {user && nearbyItems.length > 0 && !query && Object.keys(filters).length === 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900">Items Near You</h2>
              </div>
              <Link to="/nearby" className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                See all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {nearbyItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 max-w-xs">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
