import { UserInfo } from "firebase/auth";

/* Types */
export type UserData = {
  addressBook: Address[];
  authProvider: string;
  cart: { productId: string; quantity: number }[];
  defaultAddress: Address;
  email: string;
  favorites: { productId: string }[];
  firstName: string | undefined;
  lastName: string | undefined;
  wishlist: string[]; 
  uid: string;
};

export type Address = {
  city: string;
  state: string;
  street: string;
  zip: number;
};

export type Department = {
  id: number;
  name: string;
};

/* Store Types */
export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string; // ISO date string
    reviewerName: string;
    reviewerEmail?: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
};

export type ProductResponse = {
  limit: number;
  products: Product[];
  skip: number; 
  total: number;
}

export type Order = {
  address: Address;
  orderDate: Date;
  orderId: string;
  products: string[];
  userId: string;
}

export type ExtraOrderInfo = {
  totalOrders: number;
  recentOrders: number; 
}

/* State Interfaces */
export interface LocationState {
  userLocation: Address | null;
  lastFetched: number | null;
}

export interface AuthState {
  authInfo: UserInfo | null;
}
export interface UserState {
  userData: UserData | null;
}

export interface RootState {
  location: LocationState;
  auth: AuthState;
  user: UserState;
  // other slices...
}
