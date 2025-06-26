
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yuemklmnxshsvruhlafe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZW1rbG1ueHNoc3ZydWhsYWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Nzk4MzgsImV4cCI6MjA2MzQ1NTgzOH0.3P39bmmpcpFz-qoXEzsAaggf3NcUHYRgJ3UVPVReudg";

// Tipagem personalizada que inclui todas as tabelas
interface CustomDatabase {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          role: string;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      failure_types: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stamp_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          stamp_type_id: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          stamp_type_id?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          stamp_type_id?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      print_entries: {
        Row: {
          id: string;
          date: string;
          stamp_type_id: string;
          quantity: number;
          employee_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          stamp_type_id: string;
          quantity: number;
          employee_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          stamp_type_id?: string;
          quantity?: number;
          employee_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      failure_entries: {
        Row: {
          id: string;
          date: string;
          product_id: string;
          failure_type_id: string;
          quantity: number;
          employee_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          product_id: string;
          failure_type_id: string;
          quantity: number;
          employee_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          product_id?: string;
          failure_type_id?: string;
          quantity?: number;
          employee_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sewing_entries: {
        Row: {
          id: string;
          date: string;
          product_id: string;
          quantity: number;
          sewers_count: number;
          employee_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          product_id: string;
          quantity: number;
          sewers_count?: number;
          employee_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          product_id?: string;
          quantity?: number;
          sewers_count?: number;
          employee_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales_entries: {
        Row: {
          id: string;
          date: string;
          total_sales: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          total_sales: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          total_sales?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_entry_id: string;
          product_id: string;
          quantity: number;
          unit_price: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_entry_id: string;
          product_id: string;
          quantity: number;
          unit_price?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_entry_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number | null;
          created_at?: string;
        };
      };
      shipping_entries: {
        Row: {
          id: string;
          date: string;
          orders_shipped: number;
          pending_orders: number;
          late_custom_orders: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          orders_shipped?: number;
          pending_orders?: number;
          late_custom_orders?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          orders_shipped?: number;
          pending_orders?: number;
          late_custom_orders?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      production_orders: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          start_date: string;
          end_date: string | null;
          product_id: string | null;
          quantity: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status?: string;
          start_date: string;
          end_date?: string | null;
          product_id?: string | null;
          quantity: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          product_id?: string | null;
          quantity?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
