import { Link } from 'react-router-dom';
import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import ItineraryCard from '../components/ItineraryCard';
import { MapPin } from 'lucide-react';

export default function ItinerariesPage() {
  const { itineraries } = useItineraries();

  return (
    <main className='min-h-screen bg-gradient-to-b from-orange-50 via-white to-white'>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <div className='mb-10 flex items-end justify-between gap-4'>
          <div>
            <p className='flex gap-1 items-center text-sm font-semibold uppercase tracking-[0.2em] text-orange-500'>
              <MapPin size={16} strokeWidth={2} />
              Voyage Planner
            </p>

            <h1 className='mt-2 text-4xl font-extrabold tracking-tight text-slate-900'>
              Plan Your Next{' '}
              <span className='bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent'>
                Adventure
              </span>
            </h1>

            <p className='mt-3 max-w-2xl text-slate-600'>
              Create detailed day-by-day itineraries with attractions,
              reservations, and transport &mdash; all in one place.
            </p>
          </div>

          <Link
            to='/itinerary/new'
            className='rounded-lg bg-orange-500 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-orange-600'
          >
            New itinerary
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500'>
            No trips yet. Create your first itinerary.
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {itineraries.map((trip, index) => (
              <ItineraryCard key={trip.id} itinerary={trip} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
