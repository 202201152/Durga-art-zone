'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api/client';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  isActive: boolean;
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const category = searchParams.get('category') || '';
  const priceRange = searchParams.get('priceRange') || '';
  const material = searchParams.get('material') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchProducts();
  }, [category, priceRange, material, sort, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page,
        limit: 12,
      };

      if (category && category !== 'all') {
        params.category = category;
      }

      if (material) {
        params.material = material;
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-');
        if (min) params.minPrice = min;
        if (max) params.maxPrice = max;
      }

      if (sort) {
        params.sort = sort;
      }

      const response = await apiClient.get('/products', { params });
      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              totalProducts={pagination.total}
              category={category}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                Showing {products.length} of {pagination.total} products
              </p>
              <select
                value={sort}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (e.target.value) {
                    params.set('sort', e.target.value);
                  } else {
                    params.delete('sort');
                  }
                  params.delete('page');
                  window.location.href = `/shop?${params.toString()}`;
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
              >
                <option value="">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', String(Math.max(1, page - 1)));
                        window.location.href = `/shop?${params.toString()}`;
                      }}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.pages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString());
                              params.set('page', String(pageNum));
                              window.location.href = `/shop?${params.toString()}`;
                            }}
                            className={`px-4 py-2 border rounded-lg ${
                              page === pageNum
                                ? 'bg-[#d4a574] text-white border-[#d4a574]'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === page - 2 ||
                        pageNum === page + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', String(Math.min(pagination.pages, page + 1)));
                        window.location.href = `/shop?${params.toString()}`;
                      }}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

