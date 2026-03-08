import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, MapPin, ChevronRight, Sparkles, Info, Upload } from 'lucide-react';
import { ItemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { calculateSuggestedPrice, formatPrice } from '../utils/helpers';

const itemService = new ItemService();

export default function SellItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    size: '',
    condition: '',
    color: '',
    location: user?.location || ''
  });
  const [suggestedPriceRange, setSuggestedPriceRange] = useState<{ min: number, max: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Dresses', 'Shoes', 'Jackets', 'Bags', 'Jeans', 'Tops', 'Accessories'];
  const conditions = ['New with tags', 'Like new', 'Good', 'Worn'];

  useEffect(() => {
    if (formData.originalPrice && formData.condition) {
      const orig = parseFloat(formData.originalPrice);
      const suggested = calculateSuggestedPrice(orig, formData.condition);
      setSuggestedPriceRange(suggested);
    } else {
      setSuggestedPriceRange(null);
    }
  }, [formData.originalPrice, formData.condition]);

  const handleImageAdd = () => {
    setShowPhotoOptions(true);
  };

  const handleFileSelect = () => {
    setShowPhotoOptions(false);
    fileInputRef.current?.click();
  };

  const handleCameraSelect = () => {
    setShowPhotoOptions(false);
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    itemService.create({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      category: formData.category,
      brand: formData.brand,
      size: formData.size,
      condition: formData.condition,
      color: formData.color,
      images: images.length > 0 ? images : ['https://picsum.photos/seed/newitem/800/800'],
      sellerId: user.id,
      location: formData.location,
      status: 'available',
      createdAt: new Date().toISOString()
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">List an Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">Photos</label>
              <span className="text-xs font-bold text-gray-400">{images.length}/5 photos</span>
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />

            <input 
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100"
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                  >
                    <X size={14} />
                  </button>
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center">
                      Main Photo
                    </div>
                  )}
                </motion.div>
              ))}
              
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageAdd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all
                    ${isDragging 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 scale-[1.02]' 
                      : 'border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-gray-50'
                    }
                  `}
                >
                  {isDragging ? (
                    <Upload size={28} className="animate-bounce" />
                  ) : (
                    <Camera size={24} />
                  )}
                  <span className="text-xs font-bold mt-2">
                    {isDragging ? 'Drop to Upload' : 'Add Photo'}
                  </span>
                </button>
              )}
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-medium">
              Tip: Clear, bright photos from different angles help sell faster!
            </p>
          </div>

          {/* Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
              <input
                required
                type="text"
                placeholder="What are you selling?"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full text-lg font-medium border-none focus:ring-0 p-0 placeholder:text-gray-300"
              />
            </div>
            <hr className="border-gray-50" />
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                required
                placeholder="Describe your item, mention any flaws..."
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border-none focus:ring-0 p-0 placeholder:text-gray-300 resize-none"
              />
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Category</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="bg-transparent border-none text-sm text-gray-500 font-medium focus:ring-0 text-right cursor-pointer"
              >
                <option value="">Select</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <hr className="border-gray-50" />
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Brand</label>
              <input
                required
                type="text"
                placeholder="e.g. Nike"
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                className="bg-transparent border-none text-sm text-gray-500 font-medium focus:ring-0 text-right"
              />
            </div>
            <hr className="border-gray-50" />
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Size</label>
              <input
                required
                type="text"
                placeholder="e.g. M, UK 10"
                value={formData.size}
                onChange={e => setFormData({...formData, size: e.target.value})}
                className="bg-transparent border-none text-sm text-gray-500 font-medium focus:ring-0 text-right"
              />
            </div>
            <hr className="border-gray-50" />
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Condition</label>
              <select 
                required
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                className="bg-transparent border-none text-sm text-gray-500 font-medium focus:ring-0 text-right cursor-pointer"
              >
                <option value="">Select</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Original Price</label>
              <div className="flex items-center">
                <span className="text-gray-400 font-bold mr-1">R</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.originalPrice}
                  onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                  className="bg-transparent border-none text-sm font-medium text-gray-500 focus:ring-0 text-right w-24"
                />
              </div>
            </div>
            <hr className="border-gray-50" />
            
            <AnimatePresence>
              {suggestedPriceRange && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-emerald-600" size={16} />
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Suggested Price</span>
                  </div>
                  <p className="text-sm text-emerald-700 font-medium">
                    Based on the condition, we suggest listing this for <span className="font-bold">{formatPrice(suggestedPriceRange.min)} – {formatPrice(suggestedPriceRange.max)}</span>.
                  </p>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, price: suggestedPriceRange.max.toString()})}
                    className="mt-3 text-xs font-bold text-emerald-600 underline"
                  >
                    Apply suggested price
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Listing Price</label>
              <div className="flex items-center">
                <span className="text-gray-400 font-bold mr-1">R</span>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="bg-transparent border-none text-lg font-black text-emerald-600 focus:ring-0 text-right w-24"
                />
              </div>
            </div>
            <hr className="border-gray-50" />
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-bold text-gray-900">Location</label>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="bg-transparent border-none text-sm font-medium focus:ring-0 text-right"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            List Item
          </button>
        </form>
      </div>

      {/* Photo Options Modal */}
      <AnimatePresence>
        {showPhotoOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhotoOptions(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[70] md:max-w-md md:mx-auto md:mb-8 md:rounded-[40px]"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-black text-gray-900 mb-6 text-center">Add Photo</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCameraSelect}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                >
                  <Camera size={32} className="mb-3" />
                  <span className="font-bold">Take Photo</span>
                </button>
                <button
                  onClick={handleFileSelect}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Upload size={32} className="mb-3" />
                  <span className="font-bold">Library</span>
                </button>
              </div>
              <button
                onClick={() => setShowPhotoOptions(false)}
                className="w-full mt-6 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
