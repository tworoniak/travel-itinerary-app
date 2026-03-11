export type ItineraryStatus =
  | 'planning'
  | 'confirmed'
  | 'in_progress'
  | 'completed';

export type ItineraryItemType =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'transport'
  | 'activity'
  | 'flight'
  | 'other';

export interface ItineraryItem {
  id: string;
  itinerary_id: string;
  day_number: number;
  date?: string;
  time?: string;
  title: string;
  description?: string;
  type: ItineraryItemType;
  location?: string;
  reservation_number?: string;
  cost?: number;
  notes?: string;
  order_index?: number;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  notes?: string;
  status: ItineraryStatus;
  travelers?: number;
  budget?: number;
  currency?: string;
  items: ItineraryItem[];
  created_at: string;
  updated_at: string;
}
