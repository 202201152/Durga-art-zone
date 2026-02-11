'use client';

import { useRef, useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThreeDHoverGallery, { GalleryItem } from '@/components/ui/3d-hover-gallery';
import apiClient from '@/lib/api/client';

const STATIC_GALLERY_ITEMS: GalleryItem[] = [
  { image: '/images/bracelet-gold-01.jpg.jpeg', text: 'Gold Bracelet' },
  { image: '/images/bracelet-gold-04.jpg.jpeg', text: 'Classic Gold' },
  { image: '/images/bracelet-gold-06.jpg.jpeg', text: 'Elegant Wrist' },
  { image: '/images/bracelet-gold-09.jpg.jpeg', text: 'Golden Charm' },
  { image: '/images/earring-gold-01.jpg.jpeg', text: 'Gold Earrings' },
  { image: '/images/necklace-gold-01.jpg.jpeg', text: 'Gold Necklace' },
  { image: '/images/necklace-gold-04.jpg.jpeg', text: 'Statement Piece' },
  { image: '/images/necklace-gold-07.jpg.jpeg', text: 'Luxury Chain' },
  { image: '/images/necklace-gold-09.jpg.jpeg', text: 'Golden Pendant' },
  { image: '/images/ring-gold-03.jpg.jpeg', text: 'Gold Ring' },
  { image: '/images/ring-gold-04.jpg.jpeg', text: 'Signature Ring' },
  { image: '/images/ring-gold-05.jpg.jpeg', text: 'Classic Band' },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(STATIC_GALLERY_ITEMS);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products', { params: { limit: 100 } });
        if (response.data?.success && Array.isArray(response.data.data)) {
          const products = response.data.data;
          const updatedItems = STATIC_GALLERY_ITEMS.map((item) => {
            // Find product matching the image
            // Note: DB images might be stored with or without leading slash, or relative.
            // checking simple inclusion or exact match.
            const product = products.find((p: any) =>
              p.images && p.images.some((img: string) => img === item.image || img.endsWith(item.image) || item.image.endsWith(img))
            );
            return product ? { ...item, id: product._id } : item;
          });
          setGalleryItems(updatedItems);
        }
      } catch (error) {
        console.error('Failed to fetch products for gallery linking', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch((e: any) => console.log('Autoplay prevented:', e));
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

        {/* 3D Hover Gallery Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Featured Collection
            </h2>
          </div>
          <div style={{ height: '600px', position: 'relative' }}>
            <ThreeDHoverGallery
              images={galleryItems}
              itemWidth={4}
              itemHeight={15} // Using the requested value, though functionality overrides it to fill height
              gap={0.6}
              perspective={40}
              hoverScale={1.1} // Adjusted from 12 which seems extreme/wrong scale for CSS transform 
              transitionDuration={0.8}
              backgroundColor="#ffffff"
              grayscaleStrength={0.8}
              brightnessLevel={0.6}
              activeWidth={35}
              enableKeyboardNavigation={true}
              autoPlay={true}
              autoPlayDelay={4000}
              onImageClick={(index, item) => {
                if (item.id) {
                  router.push(`/shop/${item.id}`);
                }
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
