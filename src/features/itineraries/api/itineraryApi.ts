import { supabase } from '@/lib/supabase';
import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';

// --- Mappers ---

function mapItineraryFromDb(row: any, items: any[] = []): Itinerary {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    travelers: row.travelers ?? undefined,
    budget: row.budget ?? undefined,
    currency: row.currency ?? undefined,
    status: row.status,
    coverImage: row.cover_image ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map(mapItemFromDb),
  };
}

function mapItemFromDb(row: any): ItineraryItem {
  return {
    id: row.id,
    itineraryId: row.itinerary_id,
    dayNumber: row.day,
    orderIndex: row.sort_order,
    title: row.title,
    type: row.type,
    time: row.time ?? undefined,
    location: row.location ?? undefined,
    description: row.description ?? undefined,
    reservationNumber: row.reservation_number ?? undefined,
    cost: row.cost ?? undefined,
    notes: row.notes ?? undefined,
  };
}

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');
  return user.id;
}

// --- Itineraries ---

export async function fetchItineraries(): Promise<Itinerary[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*, itinerary_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((row) => mapItineraryFromDb(row, row.itinerary_items));
}

export async function fetchItinerary(id: string): Promise<Itinerary> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*, itinerary_items(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return mapItineraryFromDb(data, data.itinerary_items);
}

export async function createItineraryApi(
  itinerary: Itinerary,
): Promise<Itinerary> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('itineraries')
    .insert({
      user_id: userId,
      title: itinerary.title,
      destination: itinerary.destination,
      start_date: itinerary.startDate,
      end_date: itinerary.endDate,
      travelers: itinerary.travelers ?? null,
      budget: itinerary.budget ?? null,
      currency: itinerary.currency ?? null,
      status: itinerary.status,
      cover_image: itinerary.coverImage ?? null,
      notes: itinerary.notes ?? null,
      // no id — let Supabase generate it
    })
    .select('*, itinerary_items(*)')
    .single();

  if (error) throw new Error(error.message);

  return mapItineraryFromDb(data, data.itinerary_items);
}

export async function updateItineraryApi(
  itinerary: Itinerary,
): Promise<Itinerary> {
  const { data, error } = await supabase
    .from('itineraries')
    .update({
      title: itinerary.title,
      destination: itinerary.destination,
      start_date: itinerary.startDate,
      end_date: itinerary.endDate,
      travelers: itinerary.travelers ?? null,
      budget: itinerary.budget ?? null,
      currency: itinerary.currency ?? null,
      status: itinerary.status,
      cover_image: itinerary.coverImage ?? null,
      notes: itinerary.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itinerary.id)
    .select('*, itinerary_items(*)')
    .single();

  if (error) throw new Error(error.message);

  return mapItineraryFromDb(data, data.itinerary_items);
}

export async function deleteItineraryApi(id: string): Promise<void> {
  const { error } = await supabase.from('itineraries').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

// --- Items ---

export async function addItemToItineraryApi(
  itineraryId: string,
  item: ItineraryItem,
): Promise<Itinerary> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from('itinerary_items').insert({
    id: item.id,
    itinerary_id: itineraryId,
    user_id: userId,
    day: item.dayNumber,
    sort_order: item.orderIndex ?? 0,
    title: item.title,
    type: item.type,
    time: item.time ?? null,
    location: item.location ?? null,
    description: item.description ?? null,
    reservation_number: item.reservationNumber ?? null,
    cost: item.cost ?? null,
    notes: item.notes ?? null,
  });

  if (error) throw new Error(error.message);

  return fetchItinerary(itineraryId);
}

export async function updateItemInItineraryApi(
  itineraryId: string,
  item: ItineraryItem,
): Promise<Itinerary> {
  const { error } = await supabase
    .from('itinerary_items')
    .update({
      day: item.dayNumber,
      sort_order: item.orderIndex ?? 0,
      title: item.title,
      type: item.type,
      time: item.time ?? null,
      location: item.location ?? null,
      description: item.description ?? null,
      reservation_number: item.reservationNumber ?? null,
      cost: item.cost ?? null,
      notes: item.notes ?? null,
    })
    .eq('id', item.id);

  if (error) throw new Error(error.message);

  return fetchItinerary(itineraryId);
}

export async function deleteItemFromItineraryApi(
  itineraryId: string,
  itemId: string,
): Promise<Itinerary> {
  const { error } = await supabase
    .from('itinerary_items')
    .delete()
    .eq('id', itemId);

  if (error) throw new Error(error.message);

  return fetchItinerary(itineraryId);
}

export async function reorderItemsInItineraryApi(
  itineraryId: string,
  dayNumber: number,
  reorderedUntimedItems: ItineraryItem[],
): Promise<Itinerary> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from('itinerary_items').upsert(
    reorderedUntimedItems.map((item, index) => ({
      id: item.id,
      itinerary_id: itineraryId,
      user_id: userId,
      day: dayNumber,
      sort_order: index,
      title: item.title,
      type: item.type,
      time: item.time ?? null,
      location: item.location ?? null,
      description: item.description ?? null,
      reservation_number: item.reservationNumber ?? null,
      cost: item.cost ?? null,
      notes: item.notes ?? null,
    })),
  );

  if (error) throw new Error(error.message);

  return fetchItinerary(itineraryId);
}
