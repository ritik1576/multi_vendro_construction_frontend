import accCement from '../assets/products/Acc Cement.jpg';
import asianPaints from '../assets/products/Asian Paints Royale 20L.jpg';
import bergerPaint from '../assets/products/Berger Easy Clean 20L.jpg';
import flyAshBricks from '../assets/products/Fly ash bricks.jpg';
import jswBar from '../assets/products/JSW bar .jpg';
import tmtBar from '../assets/products/Tmt Steel bar.jpg';
import ultratechCement from '../assets/products/ultratech-cement-1000x1000.jpg';

export const fallbackImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="%23F8FAFC"/><rect x="180" y="110" width="280" height="180" rx="18" fill="%23ffffff" stroke="%23E5E7EB" stroke-width="4"/><path d="M224 251l62-65 42 43 31-29 57 51" fill="none" stroke="%23F97316" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="395" cy="158" r="22" fill="%231E3A8A"/><text x="320" y="334" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="%230F172A">Image unavailable</text></svg>';

const imageMap = {
  'acc': accCement,
  'asian paints': asianPaints,
  'berger': bergerPaint,
  'fly ash': flyAshBricks,
  'jsw': jswBar,
  'tmt': tmtBar,
  'ultratech': ultratechCement,
};

export const getLocalProductImage = (product) => {
  if (!product || !product.name) return fallbackImage;
  const lowerName = product.name.toLowerCase();
  
  for (const [key, img] of Object.entries(imageMap)) {
    if (lowerName.includes(key)) {
      return img;
    }
  }
  
  return fallbackImage;
};
