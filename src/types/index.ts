export interface StorePublicData {
  id: string;
  storeName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumber: string;
  themeColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  cardColor?: string;
  textColor?: string;
  currency: string;
  enableWhatsapp: boolean;
  enableGateway: boolean;
}

export interface ProductData {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  description?: string;
  specifications?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  imageUrl?: string;
  categoryName?: string;
  isActive: boolean;
  imageFit?: "cover" | "contain";
  objectPositionX?: number;
  objectPositionY?: number;
  imageZoom?: number;
}

export interface CartStoreItem extends ProductData {
  quantity: number;
}
