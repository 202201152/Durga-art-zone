'use client';

import { useRef, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch((e) => console.log('Autoplay prevented:', e));
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/images/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Everyday Elegance
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
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
                { name: 'Bracelets', href: '/shop?category=bracelet', image: '/images/categories/bracelets.jpg' },
                { name: 'Earrings', href: '/shop?category=earrings', image: '/images/categories/earrings.jpg' },
                { name: 'Chains', href: '/shop?category=chains', image: '/images/categories/chains.jpg' },
                { name: 'Rings', href: '/shop?category=rings', image: '/images/categories/rings.jpg' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group overflow-hidden block"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#d4a574] transition-colors">
                      {category.name}
                    </h3>
                  </div>
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


