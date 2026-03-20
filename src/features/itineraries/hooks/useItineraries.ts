import { useCallback, useEffect, useState } from 'react';

import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';
import {
  addItemToItineraryApi,
  createItineraryApi,
  deleteItemFromItineraryApi,
  deleteItineraryApi,
  fetchItineraries,
  reorderItemsInItineraryApi,
  updateItemInItineraryApi,
  updateItineraryApi,
} from '@/features/itineraries/api/itineraryApi';

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItineraries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchItineraries();
      setItineraries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load itineraries',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItineraries();
  }, [loadItineraries]);

  const createItinerary = useCallback(async (itinerary: Itinerary) => {
    const created = await createItineraryApi(itinerary);
    setItineraries((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateItinerary = useCallback(async (itinerary: Itinerary) => {
    const updated = await updateItineraryApi(itinerary);
    setItineraries((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
    return updated;
  }, []);

  const deleteItinerary = useCallback(async (id: string) => {
    await deleteItineraryApi(id);
    setItineraries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItemToItinerary = useCallback(
    async (itineraryId: string, item: ItineraryItem) => {
      const updated = await addItemToItineraryApi(itineraryId, item);
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === updated.id ? updated : itinerary,
        ),
      );
      return updated;
    },
    [],
  );

  const updateItemInItinerary = useCallback(
    async (itineraryId: string, item: ItineraryItem) => {
      const updated = await updateItemInItineraryApi(itineraryId, item);
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === updated.id ? updated : itinerary,
        ),
      );
      return updated;
    },
    [],
  );

  const deleteItemFromItinerary = useCallback(
    async (itineraryId: string, itemId: string) => {
      const updated = await deleteItemFromItineraryApi(itineraryId, itemId);
      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === updated.id ? updated : itinerary,
        ),
      );
      return updated;
    },
    [],
  );

  const reorderItemsInItinerary = useCallback(
    async (
      itineraryId: string,
      dayNumber: number,
      reorderedUntimedItems: ItineraryItem[],
    ) => {
      const updated = await reorderItemsInItineraryApi(
        itineraryId,
        dayNumber,
        reorderedUntimedItems,
      );

      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary.id === updated.id ? updated : itinerary,
        ),
      );

      return updated;
    },
    [],
  );

  return {
    itineraries,
    isLoading,
    error,
    reload: loadItineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    addItemToItinerary,
    updateItemInItinerary,
    deleteItemFromItinerary,
    reorderItemsInItinerary,
  };
}
