// interface CartItem {
//     _id: string;
//     name: string;
//     price: number;
//     size: string;
//     image: string;
//     quantity: number;
//   }

export interface Admin {
  name: string;
  email: string;
}

// Define the ProfileData type
export interface ProfileData {
  success: boolean;
  admin: Admin;
}

export interface Admin {
  name: string;     // The name of the admin
  email: string;    // The admin's email
  password: string; // The admin's password
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin: { name: string; email: string };
  token: string;
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
  bestSeller: boolean; // "true" or "false" from the form
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
  size: string;
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
  orders: Order[];
  message: string;
}

export interface UpdateStatusPayload {
  orderId: string; // The ID of the order to be updated
  shippingStatus: string;  // The new status for the order
}

export interface UpdateStatusResponse {
  success: boolean; // Indicates if the update was successful
  message: string;  // A message from the API
}

export interface UpdateStatusForCODPayload {
  orderId: string; // The ID of the order to be updated
  paymentStatus: string;  // The new status for the order
}

export interface UpdateStatusForCODResponse {
  success: boolean; // Indicates if the update was successful
  message: string;  // A message from the API
}

export interface SingleProductResponse {
  success: boolean;
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
    date: string; // ISO date string
    // Add any other fields your product model has
  };
}