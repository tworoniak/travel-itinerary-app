import { createBrowserRouter } from 'react-router-dom';

import ItinerariesPage from '@/features/itineraries/pages/ItinerariesPage';
import CreateItineraryPage from '@/features/itineraries/pages/CreateItineraryPage';
import ItineraryDetailPage from '@/features/itineraries/pages/ItineraryDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ItinerariesPage />,
  },
  {
    path: '/itinerary/new',
    element: <CreateItineraryPage />,
  },
  {
    path: '/itinerary/:id',
    element: <ItineraryDetailPage />,
  },
]);
