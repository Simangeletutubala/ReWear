import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Settings, MapPin, Star, Package, ShoppingBag, LogOut, ChevronRight, BadgeCheck, Droplets, Trash2, Wind, Leaf, HandCoins, Info } from 'lucide-react';
import { UserService, ItemService } from '../services/api';
import { User, Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/ItemCard';
import SustainabilityStats from '../components/SustainabilityStats';
import { cn } from '../utils/helpers';
import { motion } from 'motion/react';

const itemService = new ItemService();

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'sold'>('listings');

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    const userId = id || currentUser?.id;
    if (userId) {
      const foundUser = UserService.getById(userId);
      if (foundUser) {
        setProfileUser(foundUser);
        const userItems = itemService.getBySeller(userId);
        setItems(userItems);
      }
    }
  }, [id, currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profileUser) return null;

  const listings = items.filter(i => i.status === 'available');
  const sold = items.filter(i => i.status === 'sold');
  const stats = profileUser.sustainabilityStats || { waterSaved: 0, wasteSaved: 0, co2Saved: 0 };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <img 
                src={profileUser.profileImage} 
                alt={profileUser.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-lg" 
                referrerPolicy="no-referrer"
              />
              {isOwnProfile && (
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-emerald-600">
                  <Settings size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-gray-900">{profileUser.name}</h1>
              {profileUser.verifiedSeller && (
                <div className="group relative">
                  <BadgeCheck size={24} className="text-blue-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Verified Seller ({profileUser.salesCount} sales)
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span>{profileUser.rating}</span>
              </div>
            </div>
            {profileUser.bio && (
              <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto italic">
                "{profileUser.bio}"
              </p>
            )}
          </div>

          {/* Sustainability Tracker */}
          <SustainabilityStats userId={profileUser.id} />

          {isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <Link to="/orders" className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <ShoppingBag size={20} />
                  </div>
                  <span className="font-bold text-sm">My Orders</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link to="/offers" className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <HandCoins size={20} />
                  </div>
                  <span className="font-bold text-sm">Offers</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link to="/about" className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Info size={20} />
                  </div>
                  <span className="font-bold text-sm">About ReWear</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-sm">Logout</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 opacity-0" />
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-center gap-12 border-t border-gray-50 pt-6">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{listings.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{sold.length}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sold</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{profileUser.rating}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('listings')}
            className={cn(
              "pb-3 text-sm font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'listings' ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Listings
            {activeTab === 'listings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('sold')}
            className={cn(
              "pb-3 text-sm font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'sold' ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Sold
            {activeTab === 'sold' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {(activeTab === 'listings' ? listings : sold).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {(activeTab === 'listings' ? listings : sold).length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-400 font-medium">No items to show here yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
