import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, MessageCircle, User as UserIcon, MapPin, Info } from 'lucide-react';
import { cn } from '../utils/helpers';

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MapPin, label: 'Nearby', path: '/nearby' },
    { icon: PlusSquare, label: 'Sell', path: '/sell' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive ? "text-emerald-600" : "text-gray-400"
            )}
          >
            <Icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const DesktopNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MapPin, label: 'Nearby', path: '/nearby' },
    { icon: PlusSquare, label: 'Sell', path: '/sell' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <header className="hidden md:block sticky top-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
          ReWear
        </Link>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for items, brands..."
              className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
