/**
 * Centralized API configuration for Launchpad Bharat frontend.
 * Ensures the app defaults to the live Render backend in production
 * if environment variables are missing or unconfigured.
 */

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl && envUrl.trim() !== '') {
    // Remove trailing slash if present
    return envUrl.trim().replace(/\/+$/, '');
  }

  // If in production environment (e.g. deployed on Vercel)
  if (import.meta.env.PROD) {
    return 'https://launchpad-bharat-backend.onrender.com';
  }

  // Development local fallback
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
