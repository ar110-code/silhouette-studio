export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string | null;
  createdAt?: Date | string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  colors: string[];
  sizes: string[];
  images: string[];
  details?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string | null;
    createdAt?: Date | string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  phone?: string | null;
  createdAt?: Date | string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: string;
    title: string;
    slug: string;
    images: string[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  postalCode?: string | null;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  trackingCode?: string | null;
  items: OrderItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}