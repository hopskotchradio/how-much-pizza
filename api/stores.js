import { NearbyStores } from 'dominos';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

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
}
