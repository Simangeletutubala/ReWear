import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types';
import { formatPrice } from '../utils/helpers';
import { Sparkles } from 'lucide-react';

interface OutfitSuggestionsProps {
  suggestions: Item[];
}

export const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ suggestions }) => {
  const navigate = useNavigate();

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Sparkles className="text-emerald-600" size={20} />
        </div>
        <h2 className="text-xl font-black text-gray-900">Complete the Outfit</h2>
      </div>

      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 scrollbar-hide">
        {suggestions.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(`/item/${item.id}`);
              window.scrollTo(0, 0);
            }}
            className="flex-shrink-0 w-40 text-left group"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
            <p className="text-sm font-black text-emerald-600">{formatPrice(item.price)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
