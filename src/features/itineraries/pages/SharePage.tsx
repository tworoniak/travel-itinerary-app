import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fetchItineraryByShareToken } from '@/features/itineraries/api/itineraryApi';
import type { Itinerary } from '@/features/itineraries/types/itinerary';
import { parseLocalDate, formatDateInputValue } from '@/features/itineraries/utils/date';
import { FALLBACK_COVER_IMAGE } from '@/features/itineraries/constants/defaults';
import { statusStyles } from '@/features/itineraries/constants/statusStyles';
import { Badge } from '@/components/ui/badge';
import TimelineItem from '@/features/itineraries/components/TimelineItem';

function groupByDay(items: Itinerary['items']) {
  return items.reduce<Record<number, Itinerary['items']>>((acc, item) => {
    acc[item.dayNumber] = [...(acc[item.dayNumber] ?? []), item];
    return acc;
  }, {});
}

function getDays(itinerary: Itinerary) {
  const start = parseLocalDate(itinerary.startDate);
  const end = parseLocalDate(itinerary.endDate);
  const days: { dayNumber: number; date: string }[] = [];
  const current = new Date(start);
  let n = 1;
  while (current <= end) {
    days.push({ dayNumber: n, date: formatDateInputValue(current) });
    current.setDate(current.getDate() + 1);
    n++;
  }
  return days;
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchItineraryByShareToken(token)
      .then(setItinerary)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Not found'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center'>
        <p className='text-lg font-semibold'>Trip not found</p>
        <p className='text-sm text-muted-foreground'>This link may have expired or been removed.</p>
        <Link to='/' className='text-sm text-primary underline-offset-4 hover:underline'>
          Go to Horizons
        </Link>
      </div>
    );
  }

  const days = getDays(itinerary);
  const grouped = groupByDay(itinerary.items);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-4xl px-6 py-10'>
        {/* Hero */}
        <div className='overflow-hidden rounded-2xl'>
          <div className='relative h-56'>
            <img
              src={itinerary.coverImage || FALLBACK_COVER_IMAGE}
              alt={itinerary.title}
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-slate-900/45' />
            <div className='relative z-10 flex h-full flex-col justify-end p-6 text-white'>
              <Badge className={`mb-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[itinerary.status] ?? statusStyles.planning}`}>
                {itinerary.status.replace('_', ' ')}
              </Badge>
              <h1 className='text-3xl font-bold'>{itinerary.title}</h1>
              <div className='mt-2 flex flex-wrap gap-4 text-sm text-white/90'>
                <span className='flex items-center gap-1.5'><MapPin className='h-4 w-4' />{itinerary.destination}</span>
                <span className='flex items-center gap-1.5'>
                  <CalendarDays className='h-4 w-4' />
                  {format(parseLocalDate(itinerary.startDate), 'MMM d')} — {format(parseLocalDate(itinerary.endDate), 'MMM d, yyyy')}
                </span>
                <span className='flex items-center gap-1.5'><Users className='h-4 w-4' />{itinerary.travelers} travelers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Days */}
        <div className='mt-10 space-y-12'>
          {days.map((day) => {
            const dayItems = (grouped[day.dayNumber] ?? []).sort((a, b) => {
              if (a.time && b.time) return a.time.localeCompare(b.time);
              if (a.time) return -1;
              if (b.time) return 1;
              return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
            });
            return (
              <div key={day.dayNumber}>
                <div className='mb-5'>
                  <span className='text-xs font-semibold uppercase tracking-widest text-pumpkin-spice-500'>
                    Day {day.dayNumber}
                  </span>
                  <h3 className='mt-0.5 text-lg font-bold text-slate-800'>
                    {format(parseLocalDate(day.date), 'EEEE, MMMM d')}
                  </h3>
                </div>
                {dayItems.length > 0 ? (
                  <div>
                    {dayItems.map((item, idx) => (
                      <TimelineItem
                        key={item.id}
                        item={item}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        isLast={idx === dayItems.length - 1}
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-slate-400'>No activities planned for this day.</p>
                )}
              </div>
            );
          })}
        </div>

        <p className='mt-12 text-center text-xs text-slate-400'>
          Shared via{' '}
          <Link to='/' className='underline-offset-4 hover:underline'>
            Horizons
          </Link>
        </p>
      </div>
    </div>
  );
}
