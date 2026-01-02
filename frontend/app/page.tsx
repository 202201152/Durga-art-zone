'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#faf8f5] py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Everyday Elegance
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Premium jewelry crafted with care for the modern woman. Worn with confidence.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-[#d4a574] hover:bg-[#c49560] text-white font-semibold rounded-lg transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Bracelets', href: '/shop?category=bracelet', image: '💍' },
                { name: 'Earrings', href: '/shop?category=earrings', image: '✨' },
                { name: 'Chains', href: '/shop?category=chains', image: '🔗' },
                { name: 'Rings', href: '/shop?category=rings', image: '💎' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="text-4xl mb-3">{category.image}</div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#d4a574] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


