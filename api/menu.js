import { Menu } from 'dominos';

const SLICES_BY_SIZE = {
  '10': 6,
  '12': 8,
  '14': 10,
  '16': 12,
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { storeId } = req.query;
  if (!storeId) return res.status(400).json({ error: 'storeId is required' });

  try {
    const menu = await new Menu(storeId);
    const { products, variants, sizes } = menu.menu;

    const pizzaSizes = sizes.pizza || {};

    const allVariants = Object.values(variants);
    const pizzaVariants = allVariants.filter(
      (v) => v.productCode && Object.values(products).some(
        (p) => p.code === v.productCode && p.productType === 'Pizza'
      )
    );

    const sizeGroups = {};
    for (const sizeCode of Object.keys(pizzaSizes)) {
      const sizeInfo = pizzaSizes[sizeCode];
      const sizeVariants = pizzaVariants.filter((v) => v.sizeCode === sizeCode);

      const prices = sizeVariants.map((v) => parseFloat(v.price)).filter((p) => !isNaN(p));
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;

      const basePizza = sizeVariants.find(
        (v) => v.name && v.name.includes('Pizza') && !v.name.includes('Deluxe') && !v.name.includes('Meat')
      );

      sizeGroups[sizeCode] = {
        code: sizeCode,
        name: sizeInfo.name,
        slices: SLICES_BY_SIZE[sizeCode] || 8,
        basePrice: basePizza ? parseFloat(basePizza.price) : minPrice,
        priceRange: { min: minPrice, max: maxPrice },
        variantCount: sizeVariants.length,
      };
    }

    const specialties = Object.values(products)
      .filter((p) => p.productType === 'Pizza' && p.code !== 'S_PIZZA')
      .map((p) => ({
        code: p.code,
        name: p.name,
        description: p.description,
      }));

    res.json({
      storeId,
      sizes: sizeGroups,
      specialties,
      totalVariants: pizzaVariants.length,
    });
  } catch (err) {
    console.error('Menu error:', err.message);
    res.status(500).json({ error: 'Failed to load menu' });
  }
}
