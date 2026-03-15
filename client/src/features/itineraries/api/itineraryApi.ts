import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined');
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed';

    try {
      const data = (await response.json()) as { message?: string };
      message = data.message ?? message;
    } catch {
      // ignore JSON parse failures
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const response = await fetch(`${API_URL}/itineraries`);
  return handleResponse<Itinerary[]>(response);
}

export async function fetchItinerary(id: string): Promise<Itinerary> {
  const response = await fetch(`${API_URL}/itineraries/${id}`);
  return handleResponse<Itinerary>(response);
}

export async function createItineraryApi(
  itinerary: Itinerary,
): Promise<Itinerary> {
  const response = await fetch(`${API_URL}/itineraries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itinerary),
  });

  return handleResponse<Itinerary>(response);
}

export async function updateItineraryApi(
  itinerary: Itinerary,
): Promise<Itinerary> {
  const response = await fetch(`${API_URL}/itineraries/${itinerary.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itinerary),
  });

  return handleResponse<Itinerary>(response);
}

export async function deleteItineraryApi(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/itineraries/${id}`, {
    method: 'DELETE',
  });

  return handleResponse<void>(response);
}

export async function addItemToItineraryApi(
  itineraryId: string,
  item: ItineraryItem,
): Promise<Itinerary> {
  const response = await fetch(`${API_URL}/itineraries/${itineraryId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  return handleResponse<Itinerary>(response);
}

export async function updateItemInItineraryApi(
  itineraryId: string,
  item: ItineraryItem,
): Promise<Itinerary> {
  const response = await fetch(
    `${API_URL}/itineraries/${itineraryId}/items/${item.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    },
  );

  return handleResponse<Itinerary>(response);
}

export async function deleteItemFromItineraryApi(
  itineraryId: string,
  itemId: string,
): Promise<Itinerary> {
  const response = await fetch(
    `${API_URL}/itineraries/${itineraryId}/items/${itemId}`,
    {
      method: 'DELETE',
    },
  );

  return handleResponse<Itinerary>(response);
}

export async function reorderItemsInItineraryApi(
  itineraryId: string,
  dayNumber: number,
  reorderedUntimedItems: ItineraryItem[],
): Promise<Itinerary> {
  const response = await fetch(
    `${API_URL}/itineraries/${itineraryId}/items/reorder`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayNumber,
        reorderedUntimedItems,
      }),
    },
  );

  return handleResponse<Itinerary>(response);
}
