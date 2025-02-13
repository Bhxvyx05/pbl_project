export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          dietary_preferences: string[] | null
          health_goals: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          dietary_preferences?: string[] | null
          health_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          dietary_preferences?: string[] | null
          health_goals?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      diet_plans: {
        Row: {
          id: string
          user_id: string
          plan_data: Json
          goal: string
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_data: Json
          goal: string
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_data?: Json
          goal?: string
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      food_donations: {
        Row: {
          id: string
          donor_id: string
          food_type: string
          quantity: string
          expiry_date: string
          pickup_address: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          food_type: string
          quantity: string
          expiry_date: string
          pickup_address: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string
          food_type?: string
          quantity?: string
          expiry_date?: string
          pickup_address?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}