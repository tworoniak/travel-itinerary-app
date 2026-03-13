import { useEffect, useMemo, useState } from 'react';
import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';
import { mockItineraries } from '@/features/itineraries/data/mockItineraries';

const STORAGE_KEY = 'voyage-planner-itineraries';

function readStorage(): Itinerary[] {
  if (typeof window === 'undefined') return mockItineraries;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return mockItineraries;

  try {
    return JSON.parse(raw) as Itinerary[];
  } catch {
    return mockItineraries;
  }
}

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>(() =>
    readStorage(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries));
  }, [itineraries]);

  const actions = useMemo(
    () => ({
      createItinerary: (itinerary: Itinerary) => {
        setItineraries((prev) => [itinerary, ...prev]);
      },

      updateItinerary: (updated: Itinerary) => {
        setItineraries((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      },

      deleteItinerary: (id: string) => {
        setItineraries((prev) => prev.filter((item) => item.id !== id));
      },

      addItemToItinerary: (itineraryId: string, newItem: ItineraryItem) => {
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  updated_at: new Date().toISOString(),
                  items: [...itinerary.items, newItem],
                }
              : itinerary,
          ),
        );
      },

      updateItemInItinerary: (
        itineraryId: string,
        updatedItem: ItineraryItem,
      ) => {
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  updatedAt: new Date().toISOString(),
                  items: itinerary.items.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item,
                  ),
                }
              : itinerary,
          ),
        );
      },

      deleteItemFromItinerary: (itineraryId: string, itemId: string) => {
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  updated_at: new Date().toISOString(),
                  items: itinerary.items.filter((item) => item.id !== itemId),
                }
              : itinerary,
          ),
        );
      },
    }),
    [],
  );

  return {
    itineraries,
    setItineraries,
    ...actions,
  };
}
