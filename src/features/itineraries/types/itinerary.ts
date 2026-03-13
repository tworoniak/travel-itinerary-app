export type ItineraryStatus =
  | 'planning'
  | 'confirmed'
  | 'inProgress'
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
  itineraryId: string;
  dayNumber: number;
  date?: string;
  time?: string;
  title: string;
  description?: string;
  type: ItineraryItemType;
  location?: string;
  reservationNumber?: string;
  cost?: number;
  notes?: string;
  orderIndex?: number;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  notes?: string;
  status: ItineraryStatus;
  travelers?: number;
  budget?: number;
  currency?: string;
  items: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}
