import type { Request, Response } from 'express';
import { ItineraryModel } from '../models/Itinerary.js';

export async function getItineraries(_req: Request, res: Response) {
  const itineraries = await ItineraryModel.find().sort({ updatedAt: -1 });
  res.json(itineraries);
}

export async function getItineraryById(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOne({ id: req.params.id });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  res.json(itinerary);
}

export async function createItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.create(req.body);
  res.status(201).json(itinerary);
}

export async function updateItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true },
  );

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  res.json(itinerary);
}

export async function deleteItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOneAndDelete({
    id: req.params.id,
  });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  res.status(204).send();
}

export async function addItemToItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOne({ id: req.params.id });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  itinerary.items.push(req.body);
  await itinerary.save();

  res.status(201).json(itinerary);
}

export async function updateItemInItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOne({ id: req.params.id });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  const index = itinerary.items.findIndex(
    (item) => item.id === req.params.itemId,
  );

  if (index === -1) {
    res.status(404).json({ message: 'Item not found' });
    return;
  }

  itinerary.items[index] = req.body;
  await itinerary.save();

  res.json(itinerary);
}

export async function deleteItemFromItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOne({ id: req.params.id });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  const nextItems = itinerary.items.filter(
    (item) => item.id !== req.params.itemId,
  );
  itinerary.set('items', nextItems);
  await itinerary.save();

  res.json(itinerary);
}

export async function reorderItemsInItinerary(req: Request, res: Response) {
  const itinerary = await ItineraryModel.findOne({ id: req.params.id });

  if (!itinerary) {
    res.status(404).json({ message: 'Itinerary not found' });
    return;
  }

  const { dayNumber, reorderedUntimedItems } = req.body as {
    dayNumber: number;
    reorderedUntimedItems: Array<{
      id: string;
      itineraryId: string;
      dayNumber: number;
      date?: string;
      time?: string;
      title: string;
      description?: string;
      type:
        | 'attraction'
        | 'restaurant'
        | 'hotel'
        | 'transport'
        | 'flight'
        | 'activity'
        | 'other';
      location?: string;
      reservationNumber?: string;
      cost?: number;
      notes?: string;
      orderIndex?: number;
    }>;
  };

  const otherItems = itinerary.items.filter(
    (item) => item.dayNumber !== dayNumber,
  );

  const currentDayItems = itinerary.items.filter(
    (item) => item.dayNumber === dayNumber,
  );
  const timedItems = currentDayItems.filter((item) => item.time);

  const normalizedUntimedItems = reorderedUntimedItems.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));

  const nextItems = [...otherItems, ...timedItems, ...normalizedUntimedItems];

  itinerary.set('items', nextItems);
  await itinerary.save();

  res.json(itinerary);

  console.log('reorder request', {
    itineraryId: req.params.id,
    dayNumber,
    reorderedUntimedItems: reorderedUntimedItems.map((item) => ({
      id: item.id,
      title: item.title,
      orderIndex: item.orderIndex,
    })),
  });
}
