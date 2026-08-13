// Pricing Configuration - Single Source of Truth
export const PREMIUM_PRICE_INR = import.meta.env.VITE_PREMIUM_PRICE_INR || '299';
export const PREMIUM_PRICE_LABEL = `₹${PREMIUM_PRICE_INR}/month`;
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockkey';
