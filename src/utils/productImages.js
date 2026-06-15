import { BACKEND_URL } from '../services/apiConstants';

export const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23F8FAFC"/><rect x="180" y="110" width="280" height="180" rx="18" fill="%23ffffff" stroke="%23E5E7EB" stroke-width="4"/><path d="M224 251l62-65 42 43 31-29 57 51" fill="none" stroke="%23F97316" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="395" cy="158" r="22" fill="%231E3A8A"/><text x="320" y="334" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="%230F172A">Image unavailable</text></svg>';

export const normalizeProductImage = (url) => {
  if (!url || typeof url !== 'string') return fallbackImage;
  
  let cleanUrl = url;
  if (cleanUrl.startsWith('http://')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  }

  // Fix double sys/stream or double uploads
  cleanUrl = cleanUrl.replace('/sys/stream//sys/stream/', '/sys/stream/');
  cleanUrl = cleanUrl.replace('/sys/stream/sys/stream/', '/sys/stream/');
  cleanUrl = cleanUrl.replace('//uploads/', '/uploads/');

  if (cleanUrl.startsWith('https://')) return cleanUrl;
  if (cleanUrl.startsWith('data:image') || cleanUrl.startsWith('blob:')) return cleanUrl;

  cleanUrl = cleanUrl.replace(/^\/+/, '');
  
  if (cleanUrl.startsWith('products/')) {
    return `${BACKEND_URL}/sys/stream/${cleanUrl}`;
  }

  if (!cleanUrl.startsWith('sys/stream/')) {
    // If it's another backend route
    return `${BACKEND_URL}/${cleanUrl}`;
  }
  
  return `${BACKEND_URL}/${cleanUrl}`;
};

export const normalizeCustomerImage = normalizeProductImage;

export const getLocalProductImage = (product) => {
  if (!product) return fallbackImage;
  
  const img = product.image || product.imageUrl || product.thumbnail;
  return normalizeProductImage(img);
};
