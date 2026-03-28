import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';
import {
  addItemToItineraryApi,
  createItineraryApi,
  deleteItemFromItineraryApi,
  deleteItineraryApi,
  duplicateItineraryApi,
  fetchItineraries,
  reorderItemsInItineraryApi,
  updateItemInItineraryApi,
  updateItineraryApi,
} from '@/features/itineraries/api/itineraryApi';

export const ITINERARIES_QUERY_KEY = ['itineraries'] as const;

function updateItineraryInCache(
  prev: Itinerary[] | undefined,
  updated: Itinerary,
): Itinerary[] {
  return (prev ?? []).map((it) => (it.id === updated.id ? updated : it));
}

export function useItineraries() {
  const queryClient = useQueryClient();

  const {
    data: itineraries = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ITINERARIES_QUERY_KEY,
    queryFn: fetchItineraries,
  });

  const error =
    queryError instanceof Error ? queryError.message : null;

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ITINERARIES_QUERY_KEY }),
    [queryClient],
  );

  // --- Itinerary mutations ---

  const createMutation = useMutation({
    mutationFn: createItineraryApi,
    onSuccess: (created) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev = []) => [created, ...prev],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItineraryApi,
    onSuccess: (updated) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev) => updateItineraryInCache(prev, updated),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItineraryApi,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev = []) => prev.filter((it) => it.id !== id),
      );
    },
  });

  // --- Item mutations ---

  const addItemMutation = useMutation({
    mutationFn: ({
      itineraryId,
      item,
    }: {
      itineraryId: string;
      item: ItineraryItem;
    }) => addItemToItineraryApi(itineraryId, item),
    onSuccess: (updated) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev) => updateItineraryInCache(prev, updated),
      );
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
      itineraryId,
      item,
    }: {
      itineraryId: string;
      item: ItineraryItem;
    }) => updateItemInItineraryApi(itineraryId, item),
    onSuccess: (updated) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev) => updateItineraryInCache(prev, updated),
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: ({
      itineraryId,
      itemId,
    }: {
      itineraryId: string;
      itemId: string;
    }) => deleteItemFromItineraryApi(itineraryId, itemId),
    onSuccess: (updated) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev) => updateItineraryInCache(prev, updated),
      );
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateItineraryApi,
    onSuccess: (created) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev = []) => [created, ...prev],
      );
    },
  });

  const reorderItemsMutation = useMutation({
    mutationFn: ({
      itineraryId,
      dayNumber,
      items,
    }: {
      itineraryId: string;
      dayNumber: number;
      items: ItineraryItem[];
    }) => reorderItemsInItineraryApi(itineraryId, dayNumber, items),
    onSuccess: (updated) => {
      queryClient.setQueryData<Itinerary[]>(
        ITINERARIES_QUERY_KEY,
        (prev) => updateItineraryInCache(prev, updated),
      );
    },
  });

  // --- Stable wrapper functions (same interface as before) ---

  const createItinerary = useCallback(
    (itinerary: Itinerary) => createMutation.mutateAsync(itinerary),
    [createMutation],
  );

  const updateItinerary = useCallback(
    (itinerary: Itinerary) => updateMutation.mutateAsync(itinerary),
    [updateMutation],
  );

  const deleteItinerary = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    [deleteMutation],
  );

  const addItemToItinerary = useCallback(
    (itineraryId: string, item: ItineraryItem) =>
      addItemMutation.mutateAsync({ itineraryId, item }),
    [addItemMutation],
  );

  const updateItemInItinerary = useCallback(
    (itineraryId: string, item: ItineraryItem) =>
      updateItemMutation.mutateAsync({ itineraryId, item }),
    [updateItemMutation],
  );

  const deleteItemFromItinerary = useCallback(
    (itineraryId: string, itemId: string) =>
      deleteItemMutation.mutateAsync({ itineraryId, itemId }),
    [deleteItemMutation],
  );

  const reorderItemsInItinerary = useCallback(
    (
      itineraryId: string,
      dayNumber: number,
      reorderedUntimedItems: ItineraryItem[],
    ) =>
      reorderItemsMutation.mutateAsync({
        itineraryId,
        dayNumber,
        items: reorderedUntimedItems,
      }),
    [reorderItemsMutation],
  );

  const duplicateItinerary = useCallback(
    (itinerary: Itinerary) => duplicateMutation.mutateAsync(itinerary),
    [duplicateMutation],
  );

  return {
    itineraries,
    isLoading,
    error,
    reload,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    addItemToItinerary,
    updateItemInItinerary,
    deleteItemFromItinerary,
    reorderItemsInItinerary,
    duplicateItinerary,
  };
}
