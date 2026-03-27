// In production (Vercel), API routes are at /api/*
// In development, they're at localhost:3001/api/*
const API_BASE = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001' : ''
);

export interface DominosStore {
  id: string;
  address: string;
  phone: string;
  isOpen: boolean;
  allowDelivery: boolean;
  allowCarryout: boolean;
}

export interface PizzaSize {
  code: string;
  name: string;
  slices: number;
  basePrice: number | null;
  priceRange: { min: number | null; max: number | null };
  variantCount: number;
}

export interface StoreMenu {
  storeId: string;
  sizes: Record<string, PizzaSize>;
  specialties: Array<{ code: string; name: string; description: string }>;
  totalVariants: number;
}

export async function findStores(zip: string): Promise<DominosStore[]> {
  const res = await fetch(`${API_BASE}/api/stores?zip=${encodeURIComponent(zip)}`);
  if (!res.ok) throw new Error('Failed to find stores');
  const data = await res.json();
  return data.stores;
}

export async function getMenu(storeId: string): Promise<StoreMenu> {
  const res = await fetch(`${API_BASE}/api/menu?storeId=${encodeURIComponent(storeId)}`);
  if (!res.ok) throw new Error('Failed to load menu');
  return res.json();
}
