const express = require('express');
const cors = require('cors');
const { NearbyStores, Menu } = require('dominos');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Slice counts by size (Domino's doesn't expose this in API)
const SLICES_BY_SIZE = {
  '10': 6,  // Small 10"
  '12': 8,  // Medium 12"
  '14': 10, // Large 14"
  '16': 12, // XL 16" (Brooklyn style)
};

/**
 * GET /api/stores?zip=20001
 * Find nearby Domino's stores by zip code
 */
app.get('/api/stores', async (req, res) => {
  const { zip } = req.query;
  if (!zip) return res.status(400).json({ error: 'zip is required' });

  try {
    const nearby = await new NearbyStores(zip);
    const stores = (nearby.stores || []).slice(0, 5).map((s) => ({
      id: s.StoreID,
      address: s.AddressDescription?.replace(/\n/g, ', ').trim(),
      phone: s.Phone,
      isOpen: s.IsOpen,
      allowDelivery: s.AllowDeliveryOrders,
      allowCarryout: s.AllowCarryoutOrders,
    }));
    res.json({ stores });
  } catch (err) {
    console.error('Store lookup error:', err.message);
    res.status(500).json({ error: 'Failed to find stores' });
  }
});

/**
 * GET /api/menu/:storeId
 * Get pizza menu for a specific store
 */
app.get('/api/menu/:storeId', async (req, res) => {
  const { storeId } = req.params;

  try {
    const menu = await new Menu(storeId);
    const { products, variants, sizes } = menu.menu;

    // Get pizza size info
    const pizzaSizes = sizes.pizza || {};

    // Get all pizza variants with pricing
    const allVariants = Object.values(variants);
    const pizzaVariants = allVariants.filter(
      (v) => v.productCode && Object.values(products).some(
        (p) => p.code === v.productCode && p.productType === 'Pizza'
      )
    );

    // Group by size
    const sizeGroups = {};
    for (const sizeCode of Object.keys(pizzaSizes)) {
      const sizeInfo = pizzaSizes[sizeCode];
      const sizeVariants = pizzaVariants.filter((v) => v.sizeCode === sizeCode);

      // Get price range
      const prices = sizeVariants.map((v) => parseFloat(v.price)).filter((p) => !isNaN(p));
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;

      // Get base cheese pizza price
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

    // Get specialty pizza names for display
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
});

app.listen(PORT, () => {
  console.log(`🍕 How Much Pizza API running on port ${PORT}`);
});
