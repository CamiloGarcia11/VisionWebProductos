"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StoreConfig {
  name: string;
  email: string;
  storeName: string;
  slug: string;
  logoUrl: string;
  logoType: "url" | "file";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  fontFamily: string;
  whatsapp: string;
  enableWhatsapp: boolean;
  enableGateway: boolean;
  plan: string;
  daysRemaining: number;
  initialSetupCompleted?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  specifications: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  imageFit?: "cover" | "contain";
  objectPositionX?: number;
  objectPositionY?: number;
  imageZoom?: number;
}

export interface OrderItem {
  id: string;
  customerName: string;
  customerCity?: string;
  customerAddress?: string;
  total: number;
  status: "PENDING" | "PAID" | "REJECTED";
  date: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
}

interface StoreState {
  storeConfig: StoreConfig;
  products: ProductItem[];
  orders: OrderItem[];
  setStoreConfig: (config: StoreConfig) => void;
  updateStoreConfig: (partial: Partial<StoreConfig>) => void;
  setProducts: (products: ProductItem[]) => void;
  addProduct: (product: ProductItem) => void;
  updateProduct: (product: ProductItem) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  applyGlobalDiscount: (percentage: number) => void;
  addOrder: (order: OrderItem) => void;
  updateOrderStatus: (orderId: string, status: "PENDING" | "PAID" | "REJECTED") => void;
}

const DEFAULT_STORE_CONFIG: StoreConfig = {
  name: "",
  email: "",
  storeName: "",
  slug: "",
  logoUrl: "",
  logoType: "url",
  primaryColor: "#0052FF",
  secondaryColor: "#25D366",
  backgroundColor: "#07090e",
  cardColor: "#0f172a",
  fontFamily: "Inter",
  whatsapp: "573001234567",
  enableWhatsapp: true,
  enableGateway: false,
  plan: "EMPRESA VIP",
  daysRemaining: 15,
  initialSetupCompleted: false,
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  { 
    id: "1", 
    title: "Camiseta Oversize Algodón 100%", 
    price: 55000, 
    comparePrice: 75000, 
    specifications: "Material: 100% Algodón de alta densidad | Lavado: Agua fría | Tallas: S - XL",
    stock: 14, 
    isActive: true, 
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop" 
  },
  { 
    id: "2", 
    title: "Chaqueta Denim Vintage", 
    price: 120000, 
    comparePrice: 150000, 
    specifications: "Tela: Jean 14 oz rígido | Botones: Acero reforzado | Origen: Hecho en Colombia",
    stock: 2, // Menos de 3 para probar la alerta de Últimas Unidades
    isActive: true, 
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop" 
  },
  { 
    id: "3", 
    title: "Tenis Urban Comfort White", 
    price: 180000, 
    comparePrice: 220000, 
    specifications: "Suela: EVA ultraligera | Capellada: Cuero sintético Premium | Plantilla: Ergonómica",
    stock: 9, 
    isActive: true, 
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop" 
  },
];

const DEFAULT_ORDERS: OrderItem[] = [
  { 
    id: "ORD-101", 
    customerName: "María Paula Gómez", 
    customerCity: "Bogotá",
    customerAddress: "Calle 127 #15-45",
    total: 175000, 
    status: "PENDING", 
    date: "23/07/2026, 03:45 PM",
    items: [
      { id: "1", title: "Camiseta Oversize Algodón 100%", price: 55000, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop" },
      { id: "2", title: "Chaqueta Denim Vintage", price: 120000, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop" }
    ]
  },
  { 
    id: "ORD-102", 
    customerName: "Andrés Felipe Ríos", 
    customerCity: "Medellín",
    customerAddress: "Cra 43A #1-50",
    total: 180000, 
    status: "PAID", 
    date: "23/07/2026, 02:10 PM",
    items: [
      { id: "3", title: "Tenis Urban Comfort White", price: 180000, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop" }
    ]
  }
];

export const useStoreConfig = create<StoreState>()(
  persist(
    (set, get) => ({
      storeConfig: DEFAULT_STORE_CONFIG,
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,

      setStoreConfig: (config) => set({ storeConfig: config }),

      updateStoreConfig: (partial) => 
        set((state) => ({ storeConfig: { ...state.storeConfig, ...partial } })),

      setProducts: (products) => set({ products }),

      addProduct: (product) => 
        set((state) => ({ products: [product, ...state.products] })),

      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      toggleProductActive: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        })),

      applyGlobalDiscount: (percentage) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (percentage <= 0) {
              return {
                ...p,
                comparePrice: undefined,
              };
            }
            const basePrice = p.comparePrice && p.comparePrice > p.price ? p.comparePrice : p.price;
            const discountedPrice = Math.round(basePrice * (1 - percentage / 100));
            return {
              ...p,
              comparePrice: basePrice,
              price: discountedPrice,
            };
          }),
        })),

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (orderId, newStatus) =>
        set((state) => {
          const targetOrder = state.orders.find((o) => o.id === orderId);
          if (!targetOrder) return state;

          const oldStatus = targetOrder.status;
          let updatedProducts = [...state.products];

          // Si cambia a "PAID" (y no estaba pago antes), descontar el stock de los productos comprados
          if (newStatus === "PAID" && oldStatus !== "PAID") {
            updatedProducts = updatedProducts.map((prod) => {
              const itemInOrder = targetOrder.items.find((item) => item.id === prod.id);
              if (itemInOrder) {
                const newStock = Math.max(0, prod.stock - itemInOrder.quantity);
                return {
                  ...prod,
                  stock: newStock,
                };
              }
              return prod;
            });
          }

          // Si estaba "PAID" y se pasa a "REJECTED" o "PENDING", devolver el stock
          if (oldStatus === "PAID" && newStatus !== "PAID") {
            updatedProducts = updatedProducts.map((prod) => {
              const itemInOrder = targetOrder.items.find((item) => item.id === prod.id);
              if (itemInOrder) {
                return {
                  ...prod,
                  stock: prod.stock + itemInOrder.quantity,
                };
              }
              return prod;
            });
          }

          return {
            products: updatedProducts,
            orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
          };
        }),
    }),
    {
      name: "visionweb_store_storage",
    }
  )
);
