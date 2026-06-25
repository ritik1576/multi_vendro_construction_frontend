import { Grid3X3, Building2, PaintBucket, Zap, Wrench, Hammer, Trees, PanelsTopLeft, Lightbulb, ShieldCheck, Drill, Truck, Blocks, Package, Construction } from 'lucide-react';

export const categoryIconMap = {
  'For You': Grid3X3,
  'Civil Works': Building2,
  'Paints': PaintBucket,
  'Electricals': Zap,
  'Plumbing': Wrench,
  'Hardware': Hammer,
  'Wood & Ply': Trees,
  'Glass': PanelsTopLeft,
  'Lighting': Lightbulb,
  'Safety Gear': ShieldCheck,
  'Power Tools': Drill,
  'Machinery': Truck,
  'Bricks': Blocks,
  'Cement': Package,
  'Steel': Construction,
  'Paint': PaintBucket,
  'Electrical': Zap,
  'Plywood': Trees
};

export const getCategoryIcon = (categoryName) => {
  const normalized = normalizeCategory(categoryName);
  return categoryIconMap[normalized] || categoryIconMap[categoryName] || Package;
};

// Backward compatibility for old DB categories
export const normalizeCategory = (category) => {
  if (!category) return 'General';
  const mapping = {
    'Electrical': 'Electricals',
    'Plywood': 'Wood & Ply'
  };
  return mapping[category] || category;
};
