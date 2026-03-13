import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '@/layout/AppLayout';
import ItinerariesPage from '@/features/itineraries/pages/ItinerariesPage';
import CreateItineraryPage from '@/features/itineraries/pages/CreateItineraryPage';
import ItineraryDetailPage from '@/features/itineraries/pages/ItineraryDetailPage';
import EditItineraryPage from '@/features/itineraries/pages/EditItineraryPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
      {
        path: '/itinerary/:id/edit',
        element: <EditItineraryPage />,
      },
    ],
  },
]);
