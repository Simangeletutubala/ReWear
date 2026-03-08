import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  onSearch: (query: string) => void;
}

export const FilterBar: React.FC<FiltersProps> = ({ onFilterChange, onSearch }) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    size: ''
  });

  const categories = ['Dresses', 'Shoes', 'Jackets', 'Bags', 'Jeans', 'Tops', 'Accessories'];
  const conditions = ['New with tags', 'Like New', 'Excellent', 'Good', 'Fair'];

  const handleApply = () => {
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const reset = { category: '', condition: '', minPrice: '', maxPrice: '', size: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="sticky top-0 md:top-16 bg-white/80 backdrop-blur-md z-40 py-4 px-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-sm"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/20 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilters({ ...filters, category: filters.category === cat ? '' : cat })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          filters.category === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map(cond => (
                      <button
                        key={cond}
                        onClick={() => setFilters({ ...filters, condition: filters.condition === cond ? '' : cond })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          filters.condition === cond ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Price Range</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full bg-gray-100 border-none rounded-xl py-2 px-4 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full bg-gray-100 border-none rounded-xl py-2 px-4 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-2 bg-emerald-600 text-white py-3 px-8 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
