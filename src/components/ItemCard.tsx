import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, BadgeCheck } from 'lucide-react';
import { Item, User } from '../types';
import { formatPrice, cn } from '../utils/helpers';
import { FavoriteService, UserService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface ItemCardProps {
  item: Item;
  onFavoriteToggle?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onFavoriteToggle }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [seller, setSeller] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user) {
      setIsFavorite(FavoriteService.isFavorite(user.id, item.id));
    }
    const foundSeller = UserService.getById(item.sellerId);
    if (foundSeller) setSeller(foundSeller);
  }, [user, item.id, item.sellerId]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    const added = FavoriteService.toggle(user.id, item.id);
    setIsFavorite(added);
    if (onFavoriteToggle) onFavoriteToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link to={`/item/${item.id}`}>
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={handleFavorite}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all",
              isFavorite ? "bg-emerald-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
            )}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          {item.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-black px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider">
                Sold
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-900">{formatPrice(item.price)}</h3>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-tight">{item.brand}</span>
              {seller?.verifiedSeller && <BadgeCheck size={14} className="text-blue-500" />}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-1 mb-2">{item.title}</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
            <MapPin size={10} />
            <span>{item.location}</span>
            <span className="mx-1">•</span>
            <span>{item.size}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
