export interface User extends Document {
  profile: {
    _id: string;
    name: string;
    email: string;
    password: string;
    cartData: CartItem[];  // Typed as an array of CartItem objects
  }
}

export interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    cartData: CartItem[]; // Use CartItem[] instead of any
  };
  token: string;
  message?: string;  // Optional message field
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface ProfileData {
  _id: string;
  name: string;
  email: string;
  cartData: CartItem[];  // Typed as an array of CartItem objects
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { publicId: string; imageUrl: string }[]; // Array of image objects
  category: string;
  subCategory: string;
  sizes: string[]; // Array of strings for sizes
  bestSeller: boolean;
  date: Date | string; // Can be Date or string for flexibility
}

export interface AddProductPayload {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: File[]; // Images as files before uploading
  category: string;
  subCategory: string;
  sizes: string; // Comma-separated sizes from the form
  bestSeller: string; // "true" or "false" from the form
  date: string; // Date as a string
}

// Response type for adding a product
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
  products: Product[]; // Array of `Course` objects
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
    images: { publicId: string; imageUrl: string }[]; // Array of image objects
    category: string;
    subCategory: string;
    sizes: string[]; // Array of strings for sizes
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

// Payload for adding an item to the cart
export interface AddToCartPayload {
  productId: string;
  size: string;
}

// Response type for cart
export interface CartResponse {
  success: string;
  message: string;
  cart: {
    _id: string;
    user: string;
    items: CartItem[];
    quantity: number;
    totalPrice: number;
    shippingCharges: number;
  };
  subtotal: number;
  tax: number;
  shippingCharges: number;
  totalPrice: number;
}

// User type (already defined)
export interface User {
  _id: string;
  name: string;
  email: string;
  cartData: CartItem[];
}

export interface UpdateCartPayload {
  productId: string; // The ID of the product to update
  size?: string;     // Optional size of the product
  quantity?: number; // Optional quantity to update
}

export interface RemoveCartPayload {
  productId: string; // The ID of the product to remove
  size?: string;     // Optional size of the product to identify the specific item
}

export interface ShippingDetail {
  _id: string;
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

export interface AddShippingDetailPayload {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
  phoneNo: number;
}

export interface ShippingDetailResponse {
  success: boolean;
  message: string;
  shippingDetail: ShippingDetail;
}

export interface UpdateShippingDetailPayload {
  id?: string;
  shippingId: string; // ID of the shipping detail to update
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
  shippingDetail: ShippingDetail; // Single shipping detail returned after creation or update
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
}