import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import TripStats from '@/features/itineraries/components/TripStats';
import DayColumn from '@/features/itineraries/components/DayColumn';
import { Button } from '@/components/ui/button';
import ItemFormDialog from '@/features/itineraries/components/ItemFormDialog';
import type {
  Itinerary,
  ItineraryItem,
  ItineraryItemType,
} from '@/features/itineraries/types/itinerary';
import {
  parseLocalDate,
  formatDateInputValue,
} from '@/features/itineraries/utils/date';

function groupItemsByDay(items: ItineraryItem[]) {
  return items.reduce<Record<number, ItineraryItem[]>>((acc, item) => {
    if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {});
}

function getTripDates(itinerary: Itinerary) {
  const start = parseLocalDate(itinerary.startDate);
  const end = parseLocalDate(itinerary.endDate);

  return {
    startLabel: format(start, 'MMM d'),
    endLabel: format(end, 'MMM d, yyyy'),
  };
}

function getDaysArray(itinerary: Itinerary) {
  const start = parseLocalDate(itinerary.startDate);
  const end = parseLocalDate(itinerary.endDate);
  const days: { dayNumber: number; date: string }[] = [];

  const current = new Date(start);
  let dayNumber = 1;

  while (current <= end) {
    days.push({
      dayNumber,
      date: formatDateInputValue(current),
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
    addItemToItinerary,
    deleteItemFromItinerary,
    updateItemInItinerary,
    deleteItinerary,
  } = useItineraries();

  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItineraryItem | null>(null);

  const navigate = useNavigate();

  const itinerary = itineraries.find((trip) => trip.id === id);

  const groupedItems = useMemo(
    () => (itinerary ? groupItemsByDay(itinerary.items) : {}),
    [itinerary],
  );

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

  const handleDeleteItinerary = () => {
    const confirmed = window.confirm(
      `Delete "${itinerary.title}"? This will remove the itinerary and all of its activities.`,
    );

    if (!confirmed) return;

    deleteItinerary(itinerary.id);
    navigate('/');
  };

  const days = getDaysArray(itinerary);
  const { startLabel, endLabel } = getTripDates(itinerary);

  const openAddDialog = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    setEditItem(null);
    setIsItemDialogOpen(true);
  };

  const openEditDialog = (item: ItineraryItem) => {
    setSelectedDay(item.dayNumber);
    setEditItem(item);
    setIsItemDialogOpen(true);
  };

  const handleSubmitItem = (values: {
    title: string;
    description?: string;
    type: ItineraryItemType;
    time?: string;
    location?: string;
    reservationNumber?: string;
    cost?: number;
    notes?: string;
  }) => {
    if (!selectedDay) return;

    if (editItem) {
      updateItemInItinerary(itinerary.id, {
        ...editItem,
        ...values,
        dayNumber: selectedDay,
      });
    } else {
      const itemCountForDay = groupedItems[selectedDay]?.length ?? 0;

      addItemToItinerary(itinerary.id, {
        id: crypto.randomUUID(),
        itineraryId: itinerary.id,
        dayNumber: selectedDay,
        date: days.find((d) => d.dayNumber === selectedDay)?.date,
        title: values.title,
        description: values.description,
        type: values.type,
        time: values.time,
        location: values.location,
        reservationNumber: values.reservationNumber,
        cost: values.cost,
        notes: values.notes,
        orderIndex: itemCountForDay + 1,
      });
    }

    setIsItemDialogOpen(false);
    setEditItem(null);
    setSelectedDay(null);
  };

  const totalCost = itinerary.items.reduce((sum, item) => {
    return sum + (item.cost ?? 0);
  }, 0);

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

        <section className='sticky top-0 z-30 mt-8 border-y border-slate-200 bg-white/90 px-6 py-3 backdrop-blur  max-w-6xl'>
          <div className='mx-auto flex max-w-6xl items-center justify-between gap-4'>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-slate-900'>
                {itinerary.title}
              </p>
              <p className='text-xs text-slate-500'>
                {startLabel} — {endLabel}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <div className='hidden text-right sm:block'>
                <p className='text-xs text-slate-400'>Planned</p>
                <p className='text-sm font-semibold text-slate-900'>
                  ${totalCost.toLocaleString()}
                </p>
              </div>

              <Button
                onClick={() => openAddDialog(1)}
                className='bg-orange-500 hover:bg-orange-600'
              >
                Add Activity
              </Button>
              <Link to={`/itinerary/${itinerary.id}/edit`}>
                <Button variant='outline'>Edit Trip</Button>
              </Link>
              <Button
                variant='outline'
                onClick={handleDeleteItinerary}
                className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
              >
                Delete Trip
              </Button>
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
              onAddItem={() => openAddDialog(day.dayNumber)}
              onEditItem={openEditDialog}
              onDeleteItem={(item) => {
                deleteItemFromItinerary(itinerary.id, item.id);
              }}
            />
          ))}
        </section>

        <ItemFormDialog
          open={isItemDialogOpen}
          onOpenChange={(open) => {
            setIsItemDialogOpen(open);
            if (!open) {
              setEditItem(null);
              setSelectedDay(null);
            }
          }}
          onSubmit={handleSubmitItem}
          editItem={editItem}
        />
      </div>
    </main>
  );
}
