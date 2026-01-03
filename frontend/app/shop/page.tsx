'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, priceRange, material, page]);

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

      const response = await apiClient.get('/products', { params });

      if (response.data?.success && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
        setPagination({
          page: 1,
          limit: 12,
          total: response.data.length,
          pages: 1,
        });
      } else {
        setProducts([]);
        setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              totalProducts={pagination.total}
              category={category}
            />
          </aside>

          {/* ================= PRODUCT LIST ================= */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm font-bold text-black">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2">
                  No products found
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or check back later
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                {/* ================= PAGINATION ================= */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', String(page - 1));
                        window.location.href = `/shop?${params.toString()}`;
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
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
                      }

                      if (
                        pageNum === page - 2 ||
                        pageNum === page + 2
                      ) {
                        return (
                          <span key={pageNum} className="px-2">
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    <button
                      disabled={page === pagination.pages}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', String(page + 1));
                        window.location.href = `/shop?${params.toString()}`;
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
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
