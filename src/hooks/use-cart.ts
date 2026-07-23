import { create } from 'zustand';
import { CartStoreItem, ProductData } from '@/types';

interface CartState {
  items: CartStoreItem[];
  addItem: (product: ProductData) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const updated = [...currentItems];
      updated[existingIndex].quantity += 1;
      set({ items: updated });
    } else {
      set({ items: [...currentItems, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const updated = get().items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
