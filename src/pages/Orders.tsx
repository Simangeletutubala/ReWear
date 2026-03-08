import React, { useState, useEffect } from 'react';
import { OrderService, ItemService } from '../services/api';
import { Order, Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../utils/helpers';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const orderService = new OrderService();
const itemService = new ItemService();

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { item: Item })[]>([]);

  const fetchOrders = () => {
    if (user) {
      const userOrders = orderService.getByUser(user.id);
      const ordersWithItems = userOrders.map(order => ({
        ...order,
        item: itemService.getById(order.itemId)!
      })).filter(o => o.item);
      setOrders(ordersWithItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCompleteOrder = (orderId: string) => {
    orderService.completeOrder(orderId);
    fetchOrders();
  };

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'shipped': return <Truck size={16} className="text-blue-500" />;
      case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <Package size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Orders</h1>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const isBuyer = order.buyerId === user.id;
              return (
                <div key={order.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex gap-4">
                    <img src={order.item.images[0]} alt={order.item.title} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{order.item.title}</h3>
                        <span className="font-black text-emerald-600">{formatPrice(order.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Order #{order.id.substring(0, 8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                          {getStatusIcon(order.status)}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                            {order.status}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                          isBuyer ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {isBuyer ? 'Purchased' : 'Sold'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                    <Link 
                      to={`/item/${order.item.id}`}
                      className="flex-1 text-center py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      View Item
                    </Link>
                    <button className="flex-1 text-center py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                      Track Order
                    </button>
                    {isBuyer && order.status !== 'completed' && (
                      <button 
                        onClick={() => handleCompleteOrder(order.id)}
                        className="flex-1 text-center py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 max-w-xs">
              Your purchases and sales will appear here once you start trading.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
