export const PRODUCT_CATEGORIES = [
  'Civil Works',
  'Paints',
  'Electricals',
  'Plumbing',
  'Hardware',
  'Wood & Ply',
  'Glass',
  'Lighting',
  'Safety Gear',
  'Power Tools',
  'Machinery',
  'Bricks',
  'Cement',
  'Steel'
];

export const CATEGORY_MAPPING = {
  'Electrical': 'Electricals',
  'Plywood': 'Wood & Ply',
};

export const normalizeCategory = (category) => {
  if (!category) return 'General';
  return CATEGORY_MAPPING[category] || category;
};
