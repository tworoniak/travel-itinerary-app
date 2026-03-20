import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

import { useItineraries } from '@/features/itineraries/hooks/useItineraries';

import TripStats from '@/features/itineraries/components/TripStats';
import DayColumn from '@/features/itineraries/components/DayColumn';
import ItemFormDialog from '@/features/itineraries/components/ItemFormDialog';
import AISuggestionsDialog from '@/features/itineraries/components/AISuggestionsDialog';
import TripCostChart from '@/features/itineraries/components/TripCostChart';
import ItineraryStickyBar from '@/features/itineraries/components/ItineraryStickyBar';
import type {
  Itinerary,
  ItineraryItem,
  ItineraryItemType,
} from '@/features/itineraries/types/itinerary';

import {
  parseLocalDate,
  formatDateInputValue,
} from '@/features/itineraries/utils/date';

import type { SuggestedActivity } from '@/features/itineraries/utils/mockSuggestions';

import { notify } from '@/lib/notify';

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
    isLoading,
    error,
    addItemToItinerary,
    deleteItemFromItinerary,
    updateItemInItinerary,
    deleteItinerary,
    reorderItemsInItinerary,
  } = useItineraries();

  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItineraryItem | null>(null);

  const [isSuggestionsDialogOpen, setIsSuggestionsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const itinerary = itineraries.find((trip) => trip.id === id);

  const groupedItems = useMemo(
    () => (itinerary ? groupItemsByDay(itinerary.items) : {}),
    [itinerary],
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='mx-auto max-w-6xl px-6 py-10'>
          {/* Hero skeleton */}
          <div className='mt-5 h-64 md:h-72 rounded-2xl bg-slate-200 animate-pulse' />

          {/* Sticky bar skeleton */}
          <div className='mt-4 h-16 rounded-2xl bg-slate-200 animate-pulse' />

          {/* Stats row */}
          <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='h-24 rounded-2xl bg-slate-200 animate-pulse'
              />
            ))}
          </div>

          {/* Cost chart */}
          <div className='mt-6 h-48 rounded-2xl bg-slate-200 animate-pulse' />

          {/* Budget */}
          <div className='mt-6 h-40 rounded-2xl bg-slate-200 animate-pulse' />

          {/* Day sections */}
          <div className='mt-10 space-y-6'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='h-32 rounded-2xl bg-slate-200 animate-pulse'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen bg-slate-50'>
        <div className='mx-auto max-w-5xl px-6 py-16'>
          <div className='rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700'>
            {error}
          </div>
        </div>
      </main>
    );
  }

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

  const handleSubmitItem = async (values: {
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

    try {
      if (editItem) {
        await updateItemInItinerary(itinerary.id, {
          ...editItem,
          ...values,
          dayNumber: selectedDay,
        });
      } else {
        const itemCountForDay = groupedItems[selectedDay]?.length ?? 0;

        await addItemToItinerary(itinerary.id, {
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

      notify.success(editItem ? 'Activity updated' : 'Activity added', {
        description: editItem
          ? `${values.title} was updated.`
          : `${values.title} was added to your itinerary.`,
      });
    } catch {
      notify.error('Failed to save activity', {
        description: 'Please try again.',
      });
    }
  };

  const handleAddSuggestion = async (
    suggestion: SuggestedActivity,
    dayNumber: number,
  ) => {
    try {
      const itemCountForDay = groupedItems[dayNumber]?.length ?? 0;

      await addItemToItinerary(itinerary.id, {
        id: crypto.randomUUID(),
        itineraryId: itinerary.id,
        dayNumber,
        date: days.find((d) => d.dayNumber === dayNumber)?.date,
        title: suggestion.title,
        description: suggestion.description,
        type: suggestion.type,
        location: suggestion.location,
        cost: suggestion.cost,
        orderIndex: itemCountForDay + 1,
      });

      notify.success('Suggestion added', {
        description: `${suggestion.title} was added to Day ${dayNumber}.`,
      });
    } catch {
      notify.error('Failed to add suggestion', {
        description: 'Please try again.',
      });
    }
  };

  const totalCost = itinerary.items.reduce((sum, item) => {
    return sum + (item.cost ?? 0);
  }, 0);

  const remainingBudget =
    typeof itinerary.budget === 'number'
      ? itinerary.budget - totalCost
      : undefined;

  const budgetUsedPercentage =
    typeof itinerary.budget === 'number' && itinerary.budget > 0
      ? Math.min((totalCost / itinerary.budget) * 100, 100)
      : 0;

  return (
    <div className='min-h-screen bg-slate-50'>
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
              src={
                itinerary.coverImage ||
                'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80'
              }
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

        {/* Sticky Edit Toolbar */}
        <ItineraryStickyBar
          itineraryId={itinerary.id}
          title={itinerary.title}
          startLabel={startLabel}
          endLabel={endLabel}
          totalCost={totalCost}
          days={days}
          onAddActivity={() => openAddDialog(1)}
          onSuggestActivities={() => setIsSuggestionsDialogOpen(true)}
          onDeleteTrip={async () => {
            try {
              await deleteItinerary(itinerary.id);
              notify.success('Trip deleted', {
                description: `${itinerary.title} was removed.`,
              });
              navigate('/');
            } catch {
              notify.error('Failed to delete trip', {
                description: 'Please try again.',
              });
            }
          }}
        />

        {/* Stats Section */}
        <section className='mt-8'>
          <TripStats items={itinerary.items} />
        </section>

        {/* TripCostChart */}
        <section className='mt-6'>
          <TripCostChart items={itinerary.items} />
        </section>

        {/* Budget Section */}
        {typeof itinerary.budget === 'number' ? (
          <section className='mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-semibold text-slate-700'>
                  Budget Overview
                </p>
                <p className='mt-1 text-sm text-slate-500'>
                  Track your planned spend against your total trip budget.
                </p>
              </div>

              <div className='text-right'>
                <p className='text-xs text-slate-400'>Currency</p>
                <p className='text-sm font-medium text-slate-700'>
                  {itinerary.currency ?? 'USD'}
                </p>
              </div>
            </div>

            <div className='mt-5 grid gap-4 sm:grid-cols-3'>
              <div className='rounded-xl bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>
                  Budget
                </p>
                <p className='mt-1 text-xl font-semibold text-slate-900'>
                  ${itinerary.budget.toLocaleString()}
                </p>
              </div>

              <div className='rounded-xl bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>
                  Planned
                </p>
                <p className='mt-1 text-xl font-semibold text-slate-900'>
                  ${totalCost.toLocaleString()}
                </p>
              </div>

              <div className='rounded-xl bg-slate-50 p-4'>
                <p className='text-xs uppercase tracking-wide text-slate-400'>
                  Remaining
                </p>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    typeof remainingBudget === 'number' && remainingBudget < 0
                      ? 'text-red-600'
                      : 'text-slate-900'
                  }`}
                >
                  ${remainingBudget?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className='mt-5'>
              <div className='mb-2 flex items-center justify-between text-xs text-slate-500'>
                <span>Budget used</span>
                <span>{budgetUsedPercentage.toFixed(0)}%</span>
              </div>

              <div className='h-3 w-full overflow-hidden rounded-full bg-slate-200'>
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetUsedPercentage >= 100 ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${budgetUsedPercentage}%` }}
                />
              </div>
            </div>
          </section>
        ) : null}

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
              onDeleteItem={async (item) => {
                try {
                  await deleteItemFromItinerary(itinerary.id, item.id);
                  notify.success('Activity removed', {
                    description: `${item.title} was removed.`,
                  });
                } catch {
                  notify.error('Failed to remove activity', {
                    description: 'Please try again.',
                  });
                }
              }}
              onReorderUntimedItems={async (reorderedItems) => {
                try {
                  await reorderItemsInItinerary(
                    itinerary.id,
                    day.dayNumber,
                    reorderedItems,
                  );
                  notify.success('Activities reordered', {
                    description: `Updated Day ${day.dayNumber}.`,
                  });
                } catch {
                  notify.error('Failed to reorder activities', {
                    description: 'Please try again.',
                  });
                }
              }}
            />
          ))}
        </section>

        <AISuggestionsDialog
          open={isSuggestionsDialogOpen}
          onOpenChange={setIsSuggestionsDialogOpen}
          itinerary={itinerary}
          onAddSuggestion={handleAddSuggestion}
        />

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
    </div>
  );
}
