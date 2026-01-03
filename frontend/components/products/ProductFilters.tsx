'use client';

import { useSearchParams, useRouter } from 'next/navigation';

interface ProductFiltersProps {
  totalProducts: number;
  category?: string;
}

export default function ProductFilters({ totalProducts, category }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = category || searchParams.get('category') || 'all';
  const currentPriceRange = searchParams.get('priceRange') || '';
  const currentMaterial = searchParams.get('material') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filter changes
    params.delete('page');
    
    router.push(`/shop?${params.toString()}`);
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'bracelet', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'chains', label: 'Chains' },
    { value: 'rings', label: 'Rings' },
  ];

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-150', label: '$100 - $150' },
    { value: '150', label: '$150+' },
  ];

  const materials = [
    { value: '', label: 'All Materials' },
    { value: 'Gold', label: 'Gold Plated' },
    { value: 'Silver', label: 'Sterling Silver' },
  ];

  return (
    <div className="w-full md:w-64 bg-gray-50 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shop All</h1>
        <p className="text-gray-600 text-sm">{totalProducts} pieces</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', cat.value)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                currentCategory.toLowerCase() === cat.value
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h2>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => updateFilter('priceRange', range.value)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                currentPriceRange === range.value
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Material</h2>
        <div className="space-y-2">
          {materials.map((material) => (
            <button
              key={material.value}
              onClick={() => updateFilter('material', material.value)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                currentMaterial === material.value
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {material.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}




