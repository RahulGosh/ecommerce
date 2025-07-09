export interface User extends Document {
  profile: {
    _id: string;
    name: string;
    email: string;
    password: string;
    cartData: CartItem[];
    recentlyViewed: string[] | Product[]; // Add this line
  }
}

export interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    cartData: CartItem[];
    recentlyViewed: string[] | Product[]; // Add this line
  };
  token: string;
  message?: string;
}

export interface ProfileData {
  _id: string;
  name: string;
  email: string;
  cartData: CartItem[];
  recentlyViewed: string[] | Product[]; // Add this line
}

export interface RecentlyViewedResponse {
  success: boolean;
  message: string;
  recentlyViewed: Product[];
}

export interface AddToRecentlyViewedRequest {
  productId: string;
}

export interface AddToRecentlyViewedResponse {
  success: boolean;
  message: string;
  user: ProfileData;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { publicId: string; imageUrl: string }[]; 
  category: string;
  subCategory: string;
  sizes: string[]; 
  bestSeller: boolean;
  date: Date | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddProductPayload {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: File[]; 
  category: string;
  subCategory: string;
  sizes: string; 
  bestSeller: string;
  date: string; 
}

export interface AddProductResponse {
  success: boolean;
  message: string;
  product: {
    name: string;
    description: string;
    price: number;
    images: { publicId: string; imageUrl: string }[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestSeller: boolean;
    date: string;
  };
}

export interface ProductType {
  products: Product[];
}

export interface RemoveProductResponse {
  success: boolean;
  message: string;
  product: {
    name: string;
    description: string;
    price: number;
    images: { publicId: string; imageUrl: string }[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestSeller: boolean;
    date: string;
  };
}

export interface SingleProductRespons {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: { publicId: string; imageUrl: string }[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestSeller: boolean;
    date: Date | string;
  }
}

export interface CartItem {
  product: Product;
  _id: string;
  name: string;
  price: number;
  size: string;
  imageUrl: string;
  quantity: number;
}

export interface AddToCartPayload {
  productId: string;
  size: string;
}

export interface CartResponse {
  success: string;
  message: string;
  cart: {
    _id: string;
    user: string;
    items: CartItem[];
    quantity: number;
    totalPrice: number;
    shippingPrice: number;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  cartData: CartItem[];
}

export interface UpdateCartPayload {
  productId: string;
  size?: string;    
  quantity?: number;
}

export interface RemoveCartPayload {
  productId: string;
  size?: string;
}

export interface ShippingDetail {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
  phoneNo: number;
}


export interface CreateShippingDetailRequest {
  userId: string;
  shippingDetail: ShippingDetail;
}

export interface ShippingDetailResponse {
  success: boolean;
  message: string;
  shippingDetail: ShippingDetail;
}

export interface UpdateShippingDetailPayload {
  id?: string;
  shippingId: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: number;
  country?: string;
  phoneNo?: number;
}

export interface ShippingDetailResponse {
  success: boolean;
  message: string;
  shippingDetail: ShippingDetail;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  _id: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingDetail;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderResponse {
  order: Order[];
  message: string;
  success?: boolean;
}

export interface SinglOrderResponse {
  order: Order;
  message: string;
  success?: boolean;
}