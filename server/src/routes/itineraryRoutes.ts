import { Router } from 'express';
import {
  addItemToItinerary,
  createItinerary,
  deleteItemFromItinerary,
  deleteItinerary,
  getItineraries,
  getItineraryById,
  reorderItemsInItinerary,
  updateItemInItinerary,
  updateItinerary,
} from '../controllers/itineraryController.js';

const router = Router();

router.get('/', getItineraries);
router.get('/:id', getItineraryById);
router.post('/', createItinerary);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

router.post('/:id/items', addItemToItinerary);
router.put('/:id/items/reorder', reorderItemsInItinerary);
router.put('/:id/items/:itemId', updateItemInItinerary);
router.delete('/:id/items/:itemId', deleteItemFromItinerary);

export default router;
