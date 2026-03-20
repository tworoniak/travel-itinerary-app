export type Database = {
  public: {
    Tables: {
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          travelers: number | null;
          budget: number | null;
          currency: string | null;
          status: string;
          cover_image: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['itineraries']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['itineraries']['Insert']>;
      };
      itinerary_items: {
        Row: {
          id: string;
          itinerary_id: string;
          user_id: string;
          day: number;
          sort_order: number;
          title: string;
          type: string;
          time: string | null;
          location: string | null;
          description: string | null;
          reservation_number: string | null;
          cost: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['itinerary_items']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['itinerary_items']['Insert']
        >;
      };
    };
  };
};
