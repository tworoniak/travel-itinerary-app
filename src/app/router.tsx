import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '@/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
import LoginPage from '@/features/auth/pages/LoginPage';
import ItinerariesPage from '@/features/itineraries/pages/ItinerariesPage';
import CreateItineraryPage from '@/features/itineraries/pages/CreateItineraryPage';
import ItineraryDetailPage from '@/features/itineraries/pages/ItineraryDetailPage';
import EditItineraryPage from '@/features/itineraries/pages/EditItineraryPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <ItinerariesPage /> },
      { path: '/itinerary/new', element: <CreateItineraryPage /> },
      { path: '/itinerary/:id', element: <ItineraryDetailPage /> },
      { path: '/itinerary/:id/edit', element: <EditItineraryPage /> },
    ],
  },
]);
