export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          title: string | null;
          assets_date: string | null;
          company_id: string | null;
          created_at: string;
          digital_assets: number | null;
          file_url: string | null;
          id: string;
          liquid_assets: number | null;
          physical_assets: number | null;
        };
        Insert: {
          title: string | null;
          assets_date?: string | null;
          company_id?: string | null;
          created_at?: string;
          digital_assets?: number | null;
          file_url?: string | null;
          id?: string;
          liquid_assets?: number | null;
          physical_assets?: number | null;
        };
        Update: {
          title: string | null;
          assets_date?: string | null;
          company_id?: string | null;
          created_at?: string;
          digital_assets?: number | null;
          file_url?: string | null;
          id?: string;
          liquid_assets?: number | null;
          physical_assets?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "assets_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      companies: {
        Row: {
          address: string | null;
          business_description: string | null;
          created_at: string;
          date_incorporation: string | null;
          email: string | null;
          id: string;
          llc_address: string | null;
          llc_documents: string | null;
          llc_ein: string | null;
          llc_members: Json | null;
          llc_name: string | null;
          llc_type: string | null;
          name: string | null;
          owner_citizenship: string | null;
          owner_residence: string | null;
          state_incorporation: string | null;
        };
        Insert: {
          address?: string | null;
          business_description?: string | null;
          created_at?: string;
          date_incorporation?: string | null;
          email?: string | null;
          id?: string;
          llc_address?: string | null;
          llc_documents?: string | null;
          llc_ein?: string | null;
          llc_members?: Json | null;
          llc_name?: string | null;
          llc_type?: string | null;
          name?: string | null;
          owner_citizenship?: string | null;
          owner_residence?: string | null;
          state_incorporation?: string | null;
        };
        Update: {
          address?: string | null;
          business_description?: string | null;
          created_at?: string;
          date_incorporation?: string | null;
          email?: string | null;
          id?: string;
          llc_address?: string | null;
          llc_documents?: string | null;
          llc_ein?: string | null;
          llc_members?: Json | null;
          llc_name?: string | null;
          llc_type?: string | null;
          name?: string | null;
          owner_citizenship?: string | null;
          owner_residence?: string | null;
          state_incorporation?: string | null;
        };
        Relationships: [];
      };
      dividends: {
        Row: {
          amount: number | null;
          company_id: string | null;
          created_at: string;
          date: string | null;
          file_url: string | null;
          id: string;
          member_name: string | null;
        };
        Insert: {
          amount?: number | null;
          company_id?: string | null;
          created_at?: string;
          date?: string | null;
          file_url?: string | null;
          id?: string;
          member_name?: string | null;
        };
        Update: {
          amount?: number | null;
          company_id?: string | null;
          created_at?: string;
          date?: string | null;
          file_url?: string | null;
          id?: string;
          member_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dividends_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          business_expense: number | null;
          company_id: string | null;
          created_at: string;
          description: string | null;
          expense_date: string | null;
          file_url: string | null;
          id: string;
          personal_expense: number | null;
          price: number | null;
        };
        Insert: {
          business_expense?: number | null;
          company_id?: string | null;
          created_at?: string;
          description?: string | null;
          expense_date?: string | null;
          file_url?: string | null;
          id?: string;
          personal_expense?: number | null;
          price?: number | null;
        };
        Update: {
          business_expense?: number | null;
          company_id?: string | null;
          created_at?: string;
          description?: string | null;
          expense_date?: string | null;
          file_url?: string | null;
          id?: string;
          personal_expense?: number | null;
          price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      "gen-invoices": {
        Row: {
          company_id: string | null;
          created_at: string;
          currency: string | null;
          customerAddress: string | null;
          customerCity: string | null;
          customerName: string | null;
          date: string | null;
          id: string;
          invoiceNumber: string | null;
          items: Json | null;
          logo: string | null;
          notes: string | null;
          subtotal: number | null;
          tax: number | null;
          total: number | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string;
          currency?: string | null;
          customerAddress?: string | null;
          customerCity?: string | null;
          customerName?: string | null;
          date?: string | null;
          id?: string;
          invoiceNumber?: string | null;
          items?: Json | null;
          logo?: string | null;
          notes?: string | null;
          subtotal?: number | null;
          tax?: number | null;
          total?: number | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string;
          currency?: string | null;
          customerAddress?: string | null;
          customerCity?: string | null;
          customerName?: string | null;
          date?: string | null;
          id?: string;
          invoiceNumber?: string | null;
          items?: Json | null;
          logo?: string | null;
          notes?: string | null;
          subtotal?: number | null;
          tax?: number | null;
          total?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "gen-invoices_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          company_id: string | null;
          created_at: string;
          file_url: string | null;
          gen_invoice_id: string | null;
          id: string;
          invoice_date: string | null;
          price: number | null;
          status: string | null;
          title: string | null;
          type: string | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string;
          file_url?: string | null;
          gen_invoice_id?: string | null;
          id?: string;
          invoice_date?: string | null;
          price?: number | null;
          status?: string | null;
          title?: string | null;
          type?: string | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string;
          file_url?: string | null;
          gen_invoice_id?: string | null;
          id?: string;
          invoice_date?: string | null;
          price?: number | null;
          status?: string | null;
          title?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_gen_invoice_id_fkey";
            columns: ["gen_invoice_id"];
            isOneToOne: false;
            referencedRelation: "gen-invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      revenue: {
        Row: {
          business_income: number | null;
          company_id: string | null;
          created_at: string;
          date: string | null;
          file_url: string | null;
          id: string;
          personal_income: number | null;
        };
        Insert: {
          business_income?: number | null;
          company_id?: string | null;
          created_at?: string;
          date?: string | null;
          file_url?: string | null;
          id?: string;
          personal_income?: number | null;
        };
        Update: {
          business_income?: number | null;
          company_id?: string | null;
          created_at?: string;
          date?: string | null;
          file_url?: string | null;
          id?: string;
          personal_income?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "revenue_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_annual_financials: {
        Args: {
          company: string;
          year: number;
        };
        Returns: Json;
      };
      get_dashboard_data:
        | {
            Args: {
              filter_type: string;
              company: string;
              start_date?: string;
              end_date?: string;
            };
            Returns: Json;
          }
        | {
            Args: {
              filter_type: string;
              start_date?: string;
              end_date?: string;
            };
            Returns: Json;
          };
      get_dashboard_data_dividends: {
        Args: {
          company: string;
          filter_type: string;
          start_date?: string;
          end_date?: string;
        };
        Returns: Json;
      };
      get_dashboard_data_expenses: {
        Args: {
          filter_type: string;
          company: string;
          start_date?: string;
          end_date?: string;
        };
        Returns: Json;
      };
      get_dashboard_data_expenses1: {
        Args: {
          company: string;
          filter_type: string;
          start_date?: string;
          end_date?: string;
        };
        Returns: Json;
      };
      get_dashboard_data_revenue: {
        Args: {
          company: string;
          filter_type: string;
          start_date?: string;
          end_date?: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
