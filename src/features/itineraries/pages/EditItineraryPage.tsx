import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ItineraryForm from '@/features/itineraries/components/ItineraryForm';
import { useItineraries } from '@/features/itineraries/hooks/useItineraries';

export default function EditItineraryPage() {
  const { id } = useParams();
  const { itineraries } = useItineraries();

  const itinerary = itineraries.find((trip) => trip.id === id);

  if (!itinerary) {
    return (
      <main className='min-h-screen bg-slate-50'>
        <div className='mx-auto max-w-4xl px-6 py-16'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to itineraries
          </Link>

          <div className='mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500'>
            Itinerary not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <Link
          to={`/itinerary/${itinerary.id}`}
          className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to itinerary
        </Link>

        <div className='mb-8 mt-6'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-orange-500'>
            Edit Trip
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-900'>
            Edit itinerary
          </h1>
          <p className='mt-2 text-slate-600'>
            Update trip details, dates, budget, and notes.
          </p>
        </div>

        <ItineraryForm mode='edit' initialValues={itinerary} />
      </div>
    </main>
  );
}
