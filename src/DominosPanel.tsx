import { useState } from 'react';
import { findStores, getMenu } from './api';
import type { DominosStore, StoreMenu, PizzaSize } from './api';
import './DominosPanel.css';

interface DominosPanelProps {
  adults: number;
  kids: number;
  hungerLevel: number;
  hasSides: boolean;
  wantLeftovers: boolean;
}

export function DominosPanel({ adults, kids, hungerLevel, hasSides, wantLeftovers }: DominosPanelProps) {
  const [zip, setZip] = useState('');
  const [stores, setStores] = useState<DominosStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<DominosStore | null>(null);
  const [menu, setMenu] = useState<StoreMenu | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('14'); // default large
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setError('');
    setStores([]);
    setSelectedStore(null);
    setMenu(null);
    try {
      const results = await findStores(zip);
      setStores(results);
      if (results.length === 0) setError('No stores found near that zip code');
    } catch {
      setError('Could not search for stores. Is the API server running?');
    }
    setLoading(false);
  };

  const handleSelectStore = async (store: DominosStore) => {
    setSelectedStore(store);
    setLoading(true);
    setError('');
    try {
      const m = await getMenu(store.id);
      setMenu(m);
    } catch {
      setError('Could not load menu for this store');
    }
    setLoading(false);
  };

  // Calculate recommendation based on real menu data
  const getRecommendation = (size: PizzaSize) => {
    const totalPeople = adults + kids;
    if (totalPeople === 0) return null;

    const hungerMultiplier = 0.4 + (hungerLevel / 5) * 1.2;
    let slicesNeeded = (adults * 3 + kids * 1.5) * hungerMultiplier;
    if (hasSides) slicesNeeded *= 0.8;
    if (wantLeftovers) slicesNeeded *= 1.15;

    const pizzasNeeded = Math.ceil(slicesNeeded / size.slices);
    const totalSlices = pizzasNeeded * size.slices;
    const leftover = Math.round(totalSlices - slicesNeeded);
    const estimatedCost = size.basePrice ? (pizzasNeeded * size.basePrice).toFixed(2) : null;

    return { pizzasNeeded, totalSlices, leftover, estimatedCost, slicesPerPerson: (totalSlices / totalPeople).toFixed(1) };
  };

  return (
    <div className="dominos-panel">
      <div className="dominos-header">
        <span className="dominos-logo">🔴🔵</span>
        <span>Domino's Integration</span>
      </div>

      {/* Zip Search */}
      <div className="zip-search">
        <input
          type="text"
          placeholder="Enter zip code"
          value={zip}
          maxLength={5}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="zip-input"
        />
        <button onClick={handleSearch} disabled={loading || zip.length < 5} className="zip-btn">
          {loading ? '...' : 'Find Stores'}
        </button>
      </div>

      {error && <div className="dominos-error">{error}</div>}

      {/* Store List */}
      {stores.length > 0 && !selectedStore && (
        <div className="store-list">
          {stores.map((store) => (
            <button
              key={store.id}
              className="store-item"
              onClick={() => handleSelectStore(store)}
              disabled={!store.isOpen}
            >
              <div className="store-address">{store.address}</div>
              <div className="store-meta">
                {store.isOpen ? '🟢 Open' : '🔴 Closed'}
                {store.phone && ` · ${store.phone}`}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Store + Menu */}
      {selectedStore && menu && (
        <div className="menu-section">
          <div className="selected-store">
            📍 {selectedStore.address}
            <button className="change-store" onClick={() => { setSelectedStore(null); setMenu(null); }}>
              Change
            </button>
          </div>

          {/* Size Picker */}
          <div className="size-picker">
            {Object.values(menu.sizes)
              .sort((a, b) => parseInt(a.code) - parseInt(b.code))
              .map((size) => (
                <button
                  key={size.code}
                  className={`size-btn ${selectedSize === size.code ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size.code)}
                >
                  <div className="size-name">{size.name}</div>
                  <div className="size-slices">{size.slices} slices</div>
                  {size.basePrice && <div className="size-price">from ${size.basePrice}</div>}
                </button>
              ))}
          </div>

          {/* Recommendation */}
          {menu.sizes[selectedSize] && (() => {
            const rec = getRecommendation(menu.sizes[selectedSize]);
            if (!rec) return null;
            return (
              <div className="dominos-result">
                <div className="rec-number">{rec.pizzasNeeded}</div>
                <div className="rec-label">
                  {menu.sizes[selectedSize].name} {rec.pizzasNeeded === 1 ? 'pizza' : 'pizzas'}
                </div>
                <div className="rec-detail">
                  {rec.totalSlices} slices total · {rec.slicesPerPerson} per person
                  {rec.leftover > 0 && ` · ~${rec.leftover} leftover`}
                </div>
                {rec.estimatedCost && (
                  <div className="rec-cost">
                    ~${rec.estimatedCost} estimated (base price)
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
