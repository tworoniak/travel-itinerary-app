import { useParams } from 'react-router-dom';

export default function ItineraryDetailPage() {
  const { id } = useParams();

  return (
    <main className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-6xl px-6 py-16'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
          Itinerary detail
        </h1>
        <p className='mt-2 text-slate-600'>Trip id: {id}</p>

        <div className='mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-slate-500'>
          Detail page shell is ready. Next we’ll add stats, day columns, and
          timeline items.
        </div>
      </div>
    </main>
  );
}
