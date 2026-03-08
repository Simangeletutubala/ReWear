import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, MapPin, ShieldCheck, ChevronLeft, ChevronRight, Star, BadgeCheck, Sparkles, HandCoins } from 'lucide-react';
import { ItemService, UserService, FavoriteService, MessageService, OfferService } from '../services/api';
import { Item, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { ItemCard } from '../components/ItemCard';
import { OutfitSuggestions } from '../components/OutfitSuggestions';

const itemService = new ItemService();
const messageService = new MessageService();
const offerService = new OfferService();

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [outfitSuggestions, setOutfitSuggestions] = useState<Item[]>([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  useEffect(() => {
    if (id) {
      const foundItem = itemService.getById(id);
      if (foundItem) {
        setItem(foundItem);
        const foundSeller = UserService.getById(foundItem.sellerId);
        if (foundSeller) setSeller(foundSeller);
        if (user) setIsFavorite(FavoriteService.isFavorite(user.id, foundItem.id));
        
        // Get outfit suggestions
        const suggestions = itemService.getOutfitSuggestions(foundItem);
        setOutfitSuggestions(suggestions);
      } else {
        navigate('/');
      }
    }
  }, [id, user, navigate]);

  const handleFavorite = () => {
    if (!user || !item) return;
    const added = FavoriteService.toggle(user.id, item.id);
    setIsFavorite(added);
  };

  const handleMessage = () => {
    if (!user || !item) {
      navigate('/login');
      return;
    }
    if (user.id === item.sellerId) return;
    
    navigate(`/messages/${item.sellerId}?itemId=${item.id}`);
  };

  const handleOffer = () => {
    if (!user || !item) {
      navigate('/login');
      return;
    }
    
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) return;

    offerService.create({
      itemId: item.id,
      buyerId: user.id,
      sellerId: item.sellerId,
      offerPrice: amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    alert(`Offer of ${formatPrice(amount)} sent to ${seller?.name}!`);
    setIsOfferModalOpen(false);
    setOfferAmount('');
  };

  const handleBuy = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/checkout/${item?.id}`);
  };

  if (!item || !seller) return null;

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleFavorite} className={cn("p-2 rounded-full", isFavorite ? "text-emerald-600" : "text-gray-400")}>
            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative aspect-square bg-gray-100 md:rounded-3xl overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {item.images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev === 0 ? item.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev === item.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {item.images.map((_, i) => (
                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === currentImageIndex ? "bg-white w-4" : "bg-white/50")} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="px-4 md:px-0 flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                <p className="text-2xl font-black text-emerald-600">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                <span className="bg-gray-100 px-3 py-1 rounded-full">{item.brand}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">Size {item.size}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{item.condition}</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Complete the Outfit Section */}
            <OutfitSuggestions suggestions={outfitSuggestions} />

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={seller.profileImage} alt={seller.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-gray-900">{seller.name}</h3>
                      {seller.verifiedSeller && (
                        <div className="group relative">
                          <BadgeCheck size={16} className="text-blue-500" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Verified Seller ({seller.salesCount} sales)
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star size={12} fill="currentColor" />
                      <span>{seller.rating} Rating</span>
                    </div>
                  </div>
                </div>
                <Link to={`/profile/${seller.id}`} className="text-sm font-bold text-emerald-600 hover:underline">
                  View Profile
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>Ships from {seller.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              {user?.id !== item.sellerId ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleBuy}
                      disabled={item.status === 'sold'}
                      className="bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {item.status === 'sold' ? 'Already Sold' : 'Buy Now'}
                    </button>
                    <button 
                      onClick={() => setIsOfferModalOpen(true)}
                      disabled={item.status === 'sold'}
                      className="bg-white border-2 border-emerald-600 text-emerald-600 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-colors disabled:border-gray-300 disabled:text-gray-300"
                    >
                      Make Offer
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleMessage}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle size={20} />
                      Message
                    </button>
                    <button 
                      onClick={handleFavorite}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-colors",
                        isFavorite ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => navigate(`/sell?edit=${item.id}`)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-colors"
                >
                  Edit Listing
                </button>
              )}
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                <ShieldCheck size={14} />
                <span>Buyer Protection included on all purchases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOfferModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[32px] p-8 md:max-w-md md:mx-auto md:bottom-1/2 md:translate-y-1/2 md:rounded-[32px]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <HandCoins size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Make an Offer</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Item price: <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                </p>
                
                <div className="w-full relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">R</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-2xl py-5 pl-10 pr-4 text-2xl font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsOfferModalOpen(false)}
                    className="py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleOffer}
                    disabled={!offerAmount}
                    className="bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-200"
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
