import React, { useState, useEffect } from 'react';
import { OfferService, ItemService, UserService } from '../services/api';
import { Offer, Item, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../utils/helpers';
import { HandCoins, Check, X, Clock, ChevronLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const offerService = new OfferService();
const itemService = new ItemService();

export default function Offers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incomingOffers, setIncomingOffers] = useState<(Offer & { item: Item; buyer: User })[]>([]);
  const [outgoingOffers, setOutgoingOffers] = useState<(Offer & { item: Item; seller: User })[]>([]);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const fetchOffers = () => {
    if (!user) return;

    const incoming = offerService.getBySeller(user.id).map(offer => ({
      ...offer,
      item: itemService.getById(offer.itemId)!,
      buyer: UserService.getById(offer.buyerId)!
    })).filter(o => o.item && o.buyer);

    const outgoing = offerService.getByBuyer(user.id).map(offer => ({
      ...offer,
      item: itemService.getById(offer.itemId)!,
      seller: UserService.getById(offer.sellerId)!
    })).filter(o => o.item && o.seller);

    setIncomingOffers(incoming.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setOutgoingOffers(outgoing.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const handleUpdateStatus = (offerId: string, status: 'accepted' | 'rejected') => {
    offerService.updateStatus(offerId, status);
    fetchOffers();
  };

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-emerald-600 bg-emerald-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Offers</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('incoming')}
            className={cn(
              "pb-3 text-sm font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'incoming' ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Incoming
            {activeTab === 'incoming' && <motion.div layoutId="offerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('outgoing')}
            className={cn(
              "pb-3 text-sm font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'outgoing' ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Outgoing
            {activeTab === 'outgoing' && <motion.div layoutId="offerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {(activeTab === 'incoming' ? incomingOffers : outgoingOffers).length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {(activeTab === 'incoming' ? incomingOffers : outgoingOffers).map((offer) => (
                  <div key={offer.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex gap-4">
                      <img 
                        src={offer.item.images[0]} 
                        alt={offer.item.title} 
                        className="w-20 h-20 rounded-2xl object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 truncate">{offer.item.title}</h3>
                          <div className="text-right">
                            <p className="font-black text-emerald-600">{formatPrice(offer.offerPrice)}</p>
                            <p className="text-[10px] text-gray-400 line-through">{formatPrice(offer.item.price)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          {activeTab === 'incoming' ? `From ${offer.buyer.name}` : `To ${offer.seller.name}`} • {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full",
                            getStatusColor(offer.status)
                          )}>
                            {offer.status === 'pending' ? <Clock size={12} /> : offer.status === 'accepted' ? <Check size={12} /> : <X size={12} />}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {offer.status}
                            </span>
                          </div>

                          {activeTab === 'incoming' && offer.status === 'pending' && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <X size={20} />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                              >
                                <Check size={20} />
                              </button>
                            </div>
                          )}

                          {activeTab === 'outgoing' && offer.status === 'accepted' && (
                            <button 
                              onClick={() => navigate(`/checkout/${offer.itemId}`)}
                              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700 transition-colors"
                            >
                              Checkout
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <HandCoins className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-500 max-w-xs">
                  {activeTab === 'incoming' 
                    ? "You haven't received any offers on your items yet." 
                    : "You haven't made any offers on items yet."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
