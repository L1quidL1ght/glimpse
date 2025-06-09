export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergies: {
        Row: {
          allergy: string
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          allergy: string
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          allergy?: string
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "allergies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktail_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_golden: boolean | null
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_golden?: boolean | null
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_golden?: boolean | null
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          connected_customer_id: string
          created_at: string
          customer_id: string
          id: string
          relationship: string
        }
        Insert: {
          connected_customer_id: string
          created_at?: string
          customer_id: string
          id?: string
          relationship: string
        }
        Update: {
          connected_customer_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_connected_customer_id_fkey"
            columns: ["connected_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          note: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          note: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          note?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      food_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_golden: boolean | null
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_golden?: boolean | null
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_golden?: boolean | null
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      important_dates: {
        Row: {
          created_at: string
          customer_id: string
          date: string
          event: string
          id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          date: string
          event: string
          id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          date?: string
          event?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "important_dates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      important_notables: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          notable: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          notable: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          notable?: string
        }
        Relationships: [
          {
            foreignKeyName: "important_notables_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      spirits_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_golden: boolean | null
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_golden?: boolean | null
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_golden?: boolean | null
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "spirits_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      table_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_orders: {
        Row: {
          category: string
          created_at: string
          id: string
          item: string
          visit_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          item: string
          visit_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          item?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_orders_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          party_size: number
          table_name: string | null
          visit_date: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          party_size?: number
          table_name?: string | null
          visit_date: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          party_size?: number
          table_name?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      wine_preferences: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_golden: boolean | null
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_golden?: boolean | null
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_golden?: boolean | null
          preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "wine_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
