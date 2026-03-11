import { Link } from 'react-router-dom';

export default function ItinerariesPage() {
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
            to='/itineraries/new'
            className='rounded-lg bg-orange-500 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-orange-600'
          >
            New itinerary
          </Link>
        </div>

        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500'>
          Dashboard shell is ready. Next we’ll drop in your itinerary cards
          here.
        </div>
      </div>
    </main>
  );
}

// export default function ItinerariesPage() {
//   return (
//     <div className='min-h-screen bg-red-500 text-white p-10 text-4xl font-bold'>
//       Tailwind test
//     </div>
//   );
// }
