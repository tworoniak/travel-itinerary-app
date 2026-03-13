import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import TripStats from '@/features/itineraries/components/TripStats';
import DayColumn from '@/features/itineraries/components/DayColumn';
import type {
  Itinerary,
  ItineraryItem,
} from '@/features/itineraries/types/itinerary';

function groupItemsByDay(items: ItineraryItem[]) {
  return items.reduce<Record<number, ItineraryItem[]>>((acc, item) => {
    if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {});
}

function getTripDates(itinerary: Itinerary) {
  const start = new Date(itinerary.startDate);
  const end = new Date(itinerary.endDate);

  return {
    startLabel: format(start, 'MMM d'),
    endLabel: format(end, 'MMM d, yyyy'),
  };
}

function getDaysArray(itinerary: Itinerary) {
  const start = new Date(itinerary.startDate);
  const end = new Date(itinerary.endDate);
  const days: { dayNumber: number; date: string }[] = [];

  const current = new Date(start);
  let dayNumber = 1;

  while (current <= end) {
    days.push({
      dayNumber,
      date: current.toISOString(),
    });

    current.setDate(current.getDate() + 1);
    dayNumber += 1;
  }

  return days;
}

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const {
    itineraries,
    deleteItemFromItinerary,
    updateItemInItinerary,
    // addItemToItinerary,
  } = useItineraries();

  const itinerary = itineraries.find((trip) => trip.id === id);

  if (!itinerary) {
    return (
      <main className='min-h-screen bg-slate-50'>
        <div className='mx-auto max-w-5xl px-6 py-16'>
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

  const groupedItems = groupItemsByDay(itinerary.items);
  const days = getDaysArray(itinerary);
  const { startLabel, endLabel } = getTripDates(itinerary);

  return (
    <main className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-6xl px-6 py-10'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700'
        >
          <ArrowLeft className='h-4 w-4' />
          All itineraries
        </Link>

        <section className='mt-5 overflow-hidden rounded-2xl'>
          <div className='relative h-64 md:h-72'>
            <img
              src={itinerary.coverImage}
              alt={itinerary.title}
              className='absolute inset-0 h-full w-full object-cover'
            />

            <div className='absolute inset-0 bg-slate-900/45' />

            <div className='relative z-10 flex h-full flex-col justify-end p-8 text-white'>
              <div className='mb-3 inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'>
                {itinerary.status.replace('_', ' ')}
              </div>

              <h1 className='text-4xl font-bold tracking-tight'>
                {itinerary.title}
              </h1>

              <div className='mt-3 flex flex-wrap items-center gap-5 text-sm text-white/90'>
                <span className='inline-flex items-center gap-1.5'>
                  <MapPin className='h-4 w-4' />
                  {itinerary.destination}
                </span>

                <span className='inline-flex items-center gap-1.5'>
                  <CalendarDays className='h-4 w-4' />
                  {startLabel} — {endLabel}
                </span>

                <span className='inline-flex items-center gap-1.5'>
                  <Users className='h-4 w-4' />
                  {itinerary.travelers} travelers
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-8'>
          <TripStats items={itinerary.items} />
        </section>

        {itinerary.notes ? (
          <section className='mt-6 rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-700'>Trip Notes</p>
            <p className='mt-2 text-slate-600'>{itinerary.notes}</p>
          </section>
        ) : null}

        <section className='mt-10 space-y-12'>
          {days.map((day) => (
            <DayColumn
              key={day.dayNumber}
              dayNumber={day.dayNumber}
              date={day.date}
              items={groupedItems[day.dayNumber] ?? []}
              onAddItem={() => {
                console.log('Add item for day', day.dayNumber);
              }}
              onEditItem={(item: ItineraryItem) => {
                console.log('Edit item', item);
                updateItemInItinerary(itinerary.id, item);
              }}
              onDeleteItem={(item: ItineraryItem) => {
                deleteItemFromItinerary(itinerary.id, item.id);
              }}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

// import { useParams } from 'react-router-dom';
// import { useItineraries } from '@/features/itineraries/hooks/useItineraries';

// export default function ItineraryDetailPage() {
//   const { id } = useParams();
//   const { itineraries } = useItineraries();

//   const itinerary = itineraries.find((trip) => trip.id === id);

//   return (
//     <main className='min-h-screen bg-slate-50 p-10'>
//       <h1 className='text-3xl font-bold text-slate-900'>Itinerary Detail</h1>
//       <p className='mt-4 text-slate-600'>Route id: {id}</p>
//       <pre className='mt-6 rounded-xl bg-white p-4 text-sm shadow'>
//         {JSON.stringify(itinerary, null, 2)}
//       </pre>
//     </main>
//   );
// }
