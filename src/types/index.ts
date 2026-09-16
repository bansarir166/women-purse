export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export type ProductCategory = 
  | 'Handbags'
  | 'Shoulder Bags'
  | 'Totes'
  | 'Mini Bags'
  | 'Clutches';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  images: string[];
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  description: string;
  story: string;
  details: string[];
  materials: string;
  dimensions: string;
  strapDrop: string;
  hardware: string;
  lining: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSignature?: boolean;
  size: 'Mini' | 'Small' | 'Medium' | 'Large';
  tags: string[];
}

export interface CartItem {
  id: string; // combination of productId and colorName
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  productName?: string;
  publication?: string; // For editorial press reviews like Vogue, Harper's Bazaar
}

export interface FilterState {
  category: string;
  color: string;
  material: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  size: string;
  searchQuery: string;
}
