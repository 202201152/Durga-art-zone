'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  status: 'draft' | 'active' | 'archived';
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0 || product.status !== 'active';
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/shop/${product._id}`} className="group">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.error('Image failed to load:', product.images[0]);
              // Fallback to placeholder
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback placeholder */}
        <div className={`w-full h-full flex items-center justify-center text-gray-400 ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-sm">No Image</div>
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {discountPercentage > 0 && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-gray-900 font-medium group-hover:text-[#d4a574] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 capitalize">
          {product.category}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-semibold">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 text-sm line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}


