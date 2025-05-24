export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  picture?: string;
}

export interface Product {
  id: string;
  name: string;
  stampTypeId: string;
  // Add other fields as needed
}

export interface StampType {
  id: string;
  name: string;
  // Add other fields as needed
}

export interface FailureType {
  id: string;
  name: string;
  category: string; // Changed from union type to string to match Supabase
  created_at?: string; // Added optional Supabase timestamp fields
  updated_at?: string; // Added optional Supabase timestamp fields
  // Add other fields as needed
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email?: string;
  // Add other fields as needed
}

export interface PrintEntry {
  id: string;
  date: string;
  stampTypeId: string;
  quantity: number;
  // Add other fields as needed
}

export interface FailureEntry {
  id: string;
  date: string;
  productId: string;
  failureTypeId: string;
  quantity: number;
  // Add other fields as needed
}

export interface SewingEntry {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  sewersCount: number;
  // Add other fields as needed
}

export interface SaleEntry {
  id: string;
  date: string;
  totalSales: number;
  products: {
    productId: string;
    quantity: number;
  }[];
  // Add other fields as needed
}

export interface ShippingEntry {
  id: string;
  date: string;
  ordersShipped: number;
  orderDates: string[];
  pendingOrders: number;
  lateCustomOrders: number;
  notes?: string;
  // Add other fields as needed
}

export interface ProductionOrder {
  id: string;
  orderId: string;
  status: 'em_andamento' | 'concluida' | 'atrasada';
  startDate: string;
  endDate: string;
  // Add other fields as needed
}
