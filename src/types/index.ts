
// Product Types
export interface Product {
  id: string;
  name: string;
  stampTypeId: string;
  imageUrl?: string;
}

export interface StampType {
  id: string;
  name: string;
}

// Failure Types
export interface FailureType {
  id: string;
  name: string;
  category: 'estampa' | 'costura' | 'defeito';
}

export interface Failure {
  id: string;
  date: string;
  productId: string;
  failureTypeId: string;
  quantity: number;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  email?: string;
}

// Daily Entries Types
export interface PrintEntry {
  id: string;
  date: string;
  stampTypeId: string;
  quantity: number;
}

export interface SewingEntry {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  sewersCount: number;
}

// Sales Types
export interface SaleEntry {
  id: string;
  date: string;
  totalAmount: number;
  products: SaleProduct[];
}

export interface SaleProduct {
  productId: string;
  stampTypeId: string;
  quantity: number;
}

// Shipping Types
export interface ShippingEntry {
  id: string;
  date: string;
  orderCount: number;
  orderDates: string[];
  pendingOrdersCount: number;
  delayedCustomOrdersCount: number;
  observations?: string;
}

// Production Order Types
export interface ProductionOrder {
  id: string;
  orderId: string;
  status: 'em_andamento' | 'concluida' | 'atrasada';
  startDate: string;
  expectedEndDate: string;
  productId: string;
  quantity: number;
  observations?: string;
}

// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: 'admin' | 'user' | 'viewer';
}
