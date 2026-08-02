export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null;
          crew_size: number | null;
          destination_address: string | null;
          estimated_cost: number | null;
          home_size: string;
          id: string;
          moving_date: string;
          notes: string | null;
          origin_address: string;
          service_type: string;
          status: string | null;
          time_window: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          crew_size?: number | null;
          destination_address?: string | null;
          estimated_cost?: number | null;
          home_size: string;
          id?: string;
          moving_date: string;
          notes?: string | null;
          origin_address: string;
          service_type: string;
          status?: string | null;
          time_window: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          crew_size?: number | null;
          destination_address?: string | null;
          estimated_cost?: number | null;
          home_size?: string;
          id?: string;
          moving_date?: string;
          notes?: string | null;
          origin_address?: string;
          service_type?: string;
          status?: string | null;
          time_window?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string | null;
          created_at: string | null;
          id: string;
          method: string;
          provider_payment_id: string | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          booking_id?: string | null;
          created_at?: string | null;
          id?: string;
          method: string;
          provider_payment_id?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          booking_id?: string | null;
          created_at?: string | null;
          method?: string;
          provider_payment_id?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          phone: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          phone?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          contact_email: string;
          contact_name: string;
          contact_phone: string;
          created_at: string | null;
          destination_address: string | null;
          home_size: string;
          id: string;
          moving_date: string | null;
          notes: string | null;
          origin_address: string;
          service_type: string;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          contact_email: string;
          contact_name: string;
          contact_phone: string;
          created_at?: string | null;
          destination_address?: string | null;
          home_size: string;
          id?: string;
          moving_date?: string | null;
          notes?: string | null;
          origin_address: string;
          service_type: string;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          contact_email?: string;
          contact_name?: string;
          contact_phone?: string;
          created_at?: string | null;
          destination_address?: string | null;
          home_size?: string;
          id?: string;
          moving_date?: string | null;
          notes?: string | null;
          origin_address?: string;
          service_type?: string;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_avatar: string | null;
          author_name: string;
          created_at: string | null;
          external_url: string | null;
          id: string;
          rating: number;
          source: string | null;
          text: string;
        };
        Insert: {
          author_avatar?: string | null;
          author_name: string;
          created_at?: string | null;
          external_url?: string | null;
          id?: string;
          rating: number;
          source?: string | null;
          text: string;
        };
        Update: {
          author_avatar?: string | null;
          author_name?: string;
          created_at?: string | null;
          external_url?: string | null;
          id?: string;
          rating?: number;
          source?: string | null;
          text?: string;
        };
        Relationships: [];
      };
      time_slots: {
        Row: {
          created_at: string | null;
          current_bookings: number | null;
          date: string;
          id: string;
          is_available: boolean | null;
          max_bookings: number | null;
          time_window: string;
        };
        Insert: {
          created_at?: string | null;
          current_bookings?: number | null;
          date: string;
          id?: string;
          is_available?: boolean | null;
          max_bookings?: number | null;
          time_window: string;
        };
        Update: {
          created_at?: string | null;
          current_bookings?: number | null;
          date?: string;
          id?: string;
          is_available?: boolean | null;
          max_bookings?: number | null;
          time_window?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_slot_booking: {
        Args: { slot_date: string; slot_window: string };
        Returns: undefined;
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  DefaultSchemaCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (DefaultSchemaCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = DefaultSchemaCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : DefaultSchemaCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][DefaultSchemaCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
