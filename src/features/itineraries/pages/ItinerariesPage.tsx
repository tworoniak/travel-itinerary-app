import { useState } from 'react';
import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 12;

export default function ItinerariesPage() {
  const { itineraries, isLoading, error } = useItineraries();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (error) {
    return (
      <main className='mx-auto max-w-6xl px-6 py-10'>
        <div className='rounded-2xl border border-flag-red-200 bg-flag-red-50 p-10 text-center text-flag-red-700'>
          {error}
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-6xl px-6 py-10'>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <ItineraryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const visibleItineraries = itineraries.slice(0, visibleCount);
  const hasMore = itineraries.length > visibleCount;

  return (
    <div className='mx-auto max-w-6xl px-6 py-10'>
      {itineraries.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500'>
          No trips yet. Create your first itinerary.
        </div>
      ) : (
        <>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {visibleItineraries.map((trip, index) => (
              <ItineraryCard key={trip.id} itinerary={trip} index={index} />
            ))}
          </div>
          {hasMore && (
            <div className='mt-8 flex justify-center'>
              <Button
                variant='outline'
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
