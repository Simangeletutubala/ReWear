import React, { useMemo } from 'react';
import { Leaf, Droplets, Wind, Recycle } from 'lucide-react';
import { OrderService } from '../services/api';

const orderService = new OrderService();

interface SustainabilityStatsProps {
  userId: string;
}

export default function SustainabilityStats({ userId }: SustainabilityStatsProps) {
  const stats = useMemo(() => {
    if (!userId) return null;
    
    const orders = orderService.getByUser(userId);
    // Only count completed orders where the user is the buyer
    const completedPurchases = orders.filter(o => o.buyerId === userId && o.status === 'completed');
    const itemCount = completedPurchases.length;
    
    return {
      water: itemCount * 2700,
      co2: itemCount * 3,
      waste: itemCount * 0.5,
      count: itemCount
    };
  }, [userId]);

  if (!stats || stats.count === 0) return null;

  return (
    <div className="bg-emerald-50 rounded-[32px] p-6 mb-8 border border-emerald-100">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="text-emerald-600" size={20} />
        <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider">You helped save the planet</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-sm">
            <Droplets size={20} />
          </div>
          <p className="text-lg font-black text-emerald-900">{stats.water.toLocaleString()}</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase">Liters Water</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-sm">
            <Wind size={20} />
          </div>
          <p className="text-lg font-black text-emerald-900">{stats.co2.toLocaleString()}kg</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase">CO₂ Prevented</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-sm">
            <Recycle size={20} />
          </div>
          <p className="text-lg font-black text-emerald-900">{stats.waste.toLocaleString()}kg</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase">Waste Reduced</p>
        </div>
      </div>
      
      <p className="mt-4 text-[9px] text-emerald-600 font-bold uppercase tracking-widest text-center opacity-60">
        Based on {stats.count} second-hand {stats.count === 1 ? 'purchase' : 'purchases'}
      </p>
    </div>
  );
}
