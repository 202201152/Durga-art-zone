declare module 'razorpay' {
    export interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        image?: string;
        order_id?: string;
        handler?: (response: RazorpayResponse) => void;
        prefill?: {
            name?: string;
            email?: string;
            contact?: string;
        };
        notes?: Record<string, any>;
        theme?: {
            color?: string;
        };
        modal?: {
            ondismiss?: () => void;
            escape?: boolean;
            backdropclose?: boolean;
            handleback?: boolean;
            confirm_close?: boolean;
            escape?: boolean;
        };
    }

    export interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }

    export default class Razorpay {
        constructor(options: { key_id: string; key_secret: string });

        static open(options: RazorpayOptions): void;

        orders: {
            create(options: {
                amount: number;
                currency: string;
                receipt?: string;
                payment_capture?: number;
                notes?: Record<string, any>;
            }): Promise<{
                id: string;
                entity: string;
                amount: number;
                currency: string;
                receipt: string;
                status: string;
                created_at: number;
            }>;
        };

        payments: {
            fetch(paymentId: string): Promise<{
                id: string;
                entity: string;
                amount: number;
                currency: string;
                status: string;
                order_id: string;
                invoice_id?: string;
                international: boolean;
                method: string;
                amount_refunded: number;
                refund_status?: string;
                captured: boolean;
                description: string;
                card_id?: string;
                bank?: string;
                wallet?: string;
                vpa?: string;
                email: string;
                contact: string;
                fee: number;
                tax: number;
                created_at: number;
            }>;
        };
    }
}
