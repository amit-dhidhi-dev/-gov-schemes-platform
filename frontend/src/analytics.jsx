// src/analytics.jsx
import { track } from '@vercel/analytics';

// Agar custom events track karne ho toh (optional)
export const trackEvent = (eventName, data = {}) => {
    track(eventName, data);
};