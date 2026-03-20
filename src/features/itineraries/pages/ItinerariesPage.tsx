import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import ItineraryCard from '../components/ItineraryCard';

export default function ItinerariesPage() {
  const { itineraries, isLoading, error } = useItineraries();
  if (isLoading) {
    return (
      <main className='mx-auto max-w-6xl px-6 py-10'>
        <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500'>
          Loading trips...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='mx-auto max-w-6xl px-6 py-10'>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700'>
          {error}
        </div>
      </main>
    );
  }

  return (
    <div className='mx-auto max-w-6xl px-6 py-10'>
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
  );
}
