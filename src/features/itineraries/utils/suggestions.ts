

import { supabase } from '@/lib/supabase';
import type { ItineraryItemType } from '@/features/itineraries/types/itinerary';

export interface SuggestedActivity {
  title: string;
  type: ItineraryItemType;
  description?: string;
  location?: string;
  cost?: number;
}

export async function generateSuggestions(
  destination: string,
  existingActivities: string[] = [],
): Promise<SuggestedActivity[]> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error('Not authenticated');

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-activities`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ destination, existingActivities }),
  });

  if (!response.ok) throw new Error('Failed to fetch suggestions');

  const data = await response.json();

  if (!Array.isArray(data)) throw new Error('Invalid response');

  return data as SuggestedActivity[];
}