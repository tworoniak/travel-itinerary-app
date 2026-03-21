import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ItineraryForm from '@/features/itineraries/components/ItineraryForm';

export default function CreateItineraryPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to itineraries
        </Link>

        <div className='mb-8 mt-6'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-pumpkin-spice-500'>
            New Trip
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-900'>
            Create itinerary
          </h1>
          <p className='mt-2 text-slate-600'>
            Start a new trip and build it day by day.
          </p>
        </div>

        <ItineraryForm mode='create' />
      </div>
    </div>
  );
}
