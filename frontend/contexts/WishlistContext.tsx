'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    stock: number;
    status: 'draft' | 'active' | 'archived';
    isFeatured?: boolean;
    addedAt: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (product: any) => void;
    removeFromWishlist: (productId: string) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;
    getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistAction =
    | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
    | { type: 'CLEAR_WISHLIST' }
    | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const wishlistReducer = (state: WishlistItem[], action: WishlistAction): WishlistItem[] => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            const existingItem = state.find(item => item._id === action.payload._id);
            if (existingItem) {
                return state; // Item already in wishlist
            }
            return [...state, { ...action.payload, addedAt: new Date().toISOString() }];

        case 'REMOVE_FROM_WISHLIST':
            return state.filter(item => item._id !== action.payload);

        case 'CLEAR_WISHLIST':
            return [];

        case 'LOAD_WISHLIST':
            return action.payload;

        default:
            return state;
    }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, dispatch] = useReducer(wishlistReducer, []);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                const parsedWishlist = JSON.parse(savedWishlist);
                dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
            } catch (error) {
                console.error('Error loading wishlist:', error);
                localStorage.removeItem('wishlist');
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: any) => {
        const wishlistItem: WishlistItem = {
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            images: product.images,
            category: product.category,
            stock: product.stock,
            status: product.status,
            isFeatured: product.isFeatured,
            addedAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
    };

    const removeFromWishlist = (productId: string) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    };

    const clearWishlist = () => {
        dispatch({ type: 'CLEAR_WISHLIST' });
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlist.some(item => item._id === productId);
    };

    const getWishlistCount = (): number => {
        return wishlist.length;
    };

    const value: WishlistContextType = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
