import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Truck, CreditCard, Lock, MapPin, Package } from 'lucide-react';
import { ItemService, OrderService } from '../services/api';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { motion } from 'motion/react';

const itemService = new ItemService();
const orderService = new OrderService();

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'collection' | 'pargo'>('delivery');
  const [courier, setCourier] = useState<'the_courier_guy' | 'aramex' | 'pargo'>('the_courier_guy');
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'yoco' | 'ozow'>('payfast');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundItem = itemService.getById(id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const { showToast } = useToast();

  const handlePlaceOrder = async () => {
    if (!user || !item) return;

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order = orderService.createWithStats({
      itemId: item.id,
      buyerId: user.id,
      sellerId: item.sellerId,
      price: item.price,
      deliveryMethod: deliveryMethod === 'collection' ? 'collection' : 'delivery',
      deliveryAddress: user.location,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Update item status to sold
    itemService.update(item.id, { status: 'sold' });

    setIsProcessing(false);
    showToast(`Order placed successfully via ${paymentMethod.toUpperCase()}!`, 'success');
    navigate('/orders');
  };

  if (!item) return null;

  const fee = item.price * 0.1;
  const deliveryFee = deliveryMethod === 'delivery' ? 100 : (deliveryMethod === 'pargo' ? 65 : 0);
  const total = item.price + fee + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Item Summary */}
          <div className="bg-white rounded-3xl p-4 shadow-sm flex gap-4">
            <img src={item.images[0]} alt={item.title} className="w-24 h-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.brand} • Size {item.size}</p>
              <p className="font-black text-emerald-600">{formatPrice(item.price)}</p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Delivery Method</h2>
            <div className="space-y-3">
              <button 
                onClick={() => { setDeliveryMethod('delivery'); setCourier('the_courier_guy'); }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  deliveryMethod === 'delivery' && courier === 'the_courier_guy' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Truck className={deliveryMethod === 'delivery' ? "text-emerald-600" : "text-gray-400"} />
                  <div className="text-left">
                    <p className="font-bold text-sm">The Courier Guy</p>
                    <p className="text-xs text-gray-500">Door-to-door (2-3 days)</p>
                  </div>
                </div>
                <span className="font-bold text-sm">R100.00</span>
              </button>

              <button 
                onClick={() => { setDeliveryMethod('delivery'); setCourier('aramex'); }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  deliveryMethod === 'delivery' && courier === 'aramex' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Truck className={deliveryMethod === 'delivery' ? "text-emerald-600" : "text-gray-400"} />
                  <div className="text-left">
                    <p className="font-bold text-sm">Aramex South Africa</p>
                    <p className="text-xs text-gray-500">Store-to-door (2-3 days)</p>
                  </div>
                </div>
                <span className="font-bold text-sm">R100.00</span>
              </button>

              <button 
                onClick={() => { setDeliveryMethod('pargo'); setCourier('pargo'); }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  deliveryMethod === 'pargo' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Package className={deliveryMethod === 'pargo' ? "text-emerald-600" : "text-gray-400"} />
                  <div className="text-left">
                    <p className="font-bold text-sm">Pargo Click & Collect</p>
                    <p className="text-xs text-gray-500">Pick up at a Pargo point</p>
                  </div>
                </div>
                <span className="font-bold text-sm">R65.00</span>
              </button>

              <button 
                onClick={() => setDeliveryMethod('collection')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  deliveryMethod === 'collection' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={deliveryMethod === 'collection' ? "text-emerald-600" : "text-gray-400"} />
                  <div className="text-left">
                    <p className="font-bold text-sm">Local Collection</p>
                    <p className="text-xs text-gray-500">Pick up from {item.location}</p>
                  </div>
                </div>
                <span className="font-bold text-sm">Free</span>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setPaymentMethod('payfast')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                  paymentMethod === 'payfast' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <CreditCard size={20} className={paymentMethod === 'payfast' ? "text-emerald-600" : "text-gray-400"} />
                <span className="text-[10px] font-bold">PayFast</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('yoco')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                  paymentMethod === 'yoco' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <CreditCard size={20} className={paymentMethod === 'yoco' ? "text-emerald-600" : "text-gray-400"} />
                <span className="text-[10px] font-bold">Yoco</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('ozow')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                  paymentMethod === 'ozow' ? "border-emerald-600 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                )}
              >
                <CreditCard size={20} className={paymentMethod === 'ozow' ? "text-emerald-600" : "text-gray-400"} />
                <span className="text-[10px] font-bold">Ozow</span>
              </button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Item price</span>
              <span>{formatPrice(item.price)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Buyer protection fee</span>
              <span>{formatPrice(fee)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
            </div>
            <hr className="border-gray-50 my-2" />
            <div className="flex justify-between text-lg font-black text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <ShieldCheck className="text-emerald-600" size={24} />
            <p className="text-xs text-emerald-800 font-medium">
              Your payment is held securely until you confirm the item has arrived as described.
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={20} />
                Pay {formatPrice(total)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
