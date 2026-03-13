import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Itinerary } from '@/features/itineraries/types/itinerary';

interface ItineraryCardProps {
  itinerary: Itinerary;
  index?: number;
}

const statusStyles: Record<Itinerary['status'], string> = {
  planning: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inProgress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-slate-50 text-slate-500 border-slate-200',
};

const defaultImages = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80',
];

export default function ItineraryCard({
  itinerary,
  index = 0,
}: ItineraryCardProps) {
  const days =
    differenceInDays(
      new Date(itinerary.endDate),
      new Date(itinerary.startDate),
    ) + 1;

  const coverImg =
    itinerary.coverImage || defaultImages[index % defaultImages.length];

  return (
    <Link to={`/itinerary/${itinerary.id}`}>
      <Card className='group cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-500 hover:shadow-xl'>
        <div className='relative h-48 overflow-hidden'>
          <img
            src={coverImg}
            alt={itinerary.title}
            className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-lg font-semibold leading-tight text-white'>
              {itinerary.title}
            </h3>

            <div className='mt-1 flex items-center gap-1.5 text-sm text-white/80'>
              <MapPin className='h-3.5 w-3.5' />
              {itinerary.destination}
            </div>
          </div>

          <Badge
            className={`absolute right-3 top-3 border text-xs ${
              statusStyles[itinerary.status] || statusStyles.planning
            }`}
          >
            {itinerary.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className='p-4'>
          <div className='flex items-center justify-between text-sm text-slate-500'>
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' />
                {format(new Date(itinerary.startDate), 'MMM d')} —{' '}
                {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
              </span>

              <span className='flex items-center gap-1.5'>
                <Users className='h-3.5 w-3.5' />
                {itinerary.travelers || 1}
              </span>
            </div>

            <span className='text-xs font-medium text-slate-400'>
              {days} {days === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className='mt-3 flex items-center text-sm font-medium text-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            View itinerary <ArrowRight className='ml-1 h-4 w-4' />
          </div>
        </div>
      </Card>
    </Link>
  );
}
