
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
  stamp_type_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StampType {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FailureType {
  id: string;
  name: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PrintEntry {
  id: string;
  date: string;
  stamp_type_id: string;
  quantity: number;
  employee_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FailureEntry {
  id: string;
  date: string;
  product_id: string;
  failure_type_id: string;
  quantity: number;
  employee_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SewingEntry {
  id: string;
  date: string;
  product_id: string;
  quantity: number;
  sewers_count: number;
  employee_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleEntry {
  id: string;
  date: string;
  total_sales: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  id: string;
  sale_entry_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  created_at?: string;
}

export interface ShippingEntry {
  id: string;
  date: string;
  orders_shipped: number;
  pending_orders: number;
  late_custom_orders: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductionOrder {
  id: string;
  order_id: string;
  status: 'em_andamento' | 'concluida' | 'atrasada';
  start_date: string;
  end_date?: string;
  product_id?: string;
  quantity: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
