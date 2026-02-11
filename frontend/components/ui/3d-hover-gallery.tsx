"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn"; // Assuming a utility for class names exists, otherwise I'll use simple template literals or inline styles.

// Define props interface
export interface GalleryItem {
    image: string;
    text?: string;
    id?: string;
    [key: string]: any;
}

interface ThreeDHoverGalleryProps {
    images?: string[] | GalleryItem[];
    itemWidth?: number; // percentage or rem
    itemHeight?: number; // rem or px
    gap?: number; // rem
    perspective?: number; // px
    hoverScale?: number;
    transitionDuration?: number; // seconds
    backgroundColor?: string;
    grayscaleStrength?: number; // 0 to 1
    brightnessLevel?: number; // 0 to 1
    activeWidth?: number; // percentage
    enableKeyboardNavigation?: boolean;
    autoPlay?: boolean;
    autoPlayDelay?: number; // ms
    onImageClick?: (index: number, image: GalleryItem) => void;
    onImageHover?: (index: number, image: GalleryItem) => void;
    className?: string; // Add className prop for flexibility
}

export default function ThreeDHoverGallery({
    images = [],
    itemWidth = 4,
    itemHeight = 400,
    gap = 2,
    perspective = 1000,
    hoverScale = 1.05,
    transitionDuration = 0.5,
    backgroundColor = "transparent",
    grayscaleStrength = 0,
    brightnessLevel = 1,
    activeWidth = 35,
    enableKeyboardNavigation = true,
    autoPlay = true,
    autoPlayDelay = 4000,
    onImageClick,
    onImageHover,
    className,
}: ThreeDHoverGalleryProps) {

    // Normalize images to array of objects if strings are provided
    const galleryItems: GalleryItem[] = React.useMemo(() => {
        if (!images || images.length === 0) return [];
        return typeof images[0] === 'string'
            ? (images as string[]).map(url => ({ image: url, text: '', id: '' }))
            : (images as GalleryItem[]);
    }, [images]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-play functionality
    useEffect(() => {
        if (autoPlay && !isHovering) {
            timerRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % galleryItems.length);
            }, autoPlayDelay);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoPlay, autoPlayDelay, isHovering, galleryItems.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!enableKeyboardNavigation) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                setActiveIndex((prev) => (prev + 1) % galleryItems.length);
            } else if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enableKeyboardNavigation, galleryItems.length]);

    return (
        <div
            className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
            style={{
                backgroundColor,
                perspective: `${perspective}px`,
                gap: `${gap}px`
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex w-full h-full items-center justify-center" style={{ gap: `${gap}%` }}>
                {galleryItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <motion.div
                            key={index}
                            layout
                            onClick={() => {
                                setActiveIndex(index);
                                if (onImageClick) {
                                    onImageClick(index, item);
                                }
                            }}
                            onHoverStart={() => {
                                if (onImageHover) onImageHover(index, item);
                                setActiveIndex(index);
                            }}
                            initial={false}
                            animate={{
                                width: isActive ? `${activeWidth}%` : `${itemWidth}%`,
                                filter: isActive ? `grayscale(0) brightness(1)` : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
                                scale: isActive ? hoverScale : 1,
                                zIndex: isActive ? 10 : 1,
                            }}
                            transition={{
                                duration: transitionDuration,
                                ease: "easeInOut"
                            }}
                            className="relative h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                            style={{
                                height: '100%',
                            }}
                        >
                            <motion.img
                                src={item.image}
                                alt={item.text || `Gallery item ${index}`}
                                className="w-full h-full object-cover"
                                layoutId={`img-${index}`}
                            />

                            <AnimatePresence>
                                {isActive && item.text && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white"
                                    >
                                        <h3 className="text-xl font-bold">{item.text}</h3>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
