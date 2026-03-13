import { Link } from 'react-router-dom';
import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
// import { Card, CardContent } from '@/components/ui/card';
import ItineraryCard from '../components/ItineraryCard';

export default function ItinerariesPage() {
  const { itineraries } = useItineraries();

  return (
    <main className='min-h-screen bg-gradient-to-b from-orange-50 via-white to-white'>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <div className='mb-10 flex items-end justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-orange-500'>
              Voyage Planner
            </p>

            <h1 className='mt-2 text-4xl font-bold tracking-tight text-slate-900'>
              Plan beautiful trips.
            </h1>

            <p className='mt-3 max-w-2xl text-slate-600'>
              Rebuilding your itinerary planner as a clean React + TypeScript
              portfolio app.
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
            {/* {itineraries.map((trip) => (
              <Link key={trip.id} to={`/itinerary/${trip.id}`}>
                <Card className='overflow-hidden hover:shadow-lg transition'>
                  {trip.coverImage && (
                    <img
                      src={trip.coverImage}
                      className='h-40 w-full object-cover'
                    />
                  )}

                  <CardContent className='p-5'>
                    <h3 className='text-lg font-semibold text-slate-900'>
                      {trip.title}
                    </h3>

                    <p className='text-sm text-slate-500 mt-1'>
                      {trip.destination}
                    </p>

                    <p className='text-sm text-slate-400 mt-2'>
                      {trip.startDate} → {trip.endDate}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))} */}
            {itineraries.map((trip, index) => (
              <ItineraryCard key={trip.id} itinerary={trip} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
