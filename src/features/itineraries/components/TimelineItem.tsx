import {
  Clock,
  DollarSign,
  Hash,
  Hotel,
  Landmark,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plane,
  Ticket,
  Train,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActivityTypeIcon from '@/features/itineraries/components/ActivityTypeIcon';

import type { ItineraryItem } from '@/features/itineraries/types/itinerary';

interface TimelineItemProps {
  item: ItineraryItem;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
  isLast: boolean;
}

const typeConfig = {
  attraction: {
    icon: Landmark,
    color: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700',
  },
  restaurant: {
    icon: UtensilsCrossed,
    color: 'bg-pumpkin-spice-500',
    badge: 'bg-pumpkin-spice-50 text-pumpkin-spice-700',
  },
  hotel: {
    icon: Hotel,
    color: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700',
  },
  transport: {
    icon: Train,
    color: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700',
  },
  flight: {
    icon: Plane,
    color: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  activity: {
    icon: Ticket,
    color: 'bg-pink-500',
    badge: 'bg-pink-50 text-pink-700',
  },
  other: {
    icon: MapPin,
    color: 'bg-slate-500',
    badge: 'bg-slate-50 text-slate-700',
  },
} as const;

export default function TimelineItem({
  item,
  onEdit,
  onDelete,
  isLast,
}: TimelineItemProps) {
  const config = typeConfig[item.type] ?? typeConfig.other;
  // const Icon = config.icon;

  return (
    <div className='group flex w-full gap-4'>
      <div className='flex flex-col items-center'>
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.color} shadow-md`}
        >
          <ActivityTypeIcon type={item.type} className='h-4 w-4 text-white' />
        </div>
        {!isLast && <div className='my-1 w-px flex-1 bg-slate-200' />}
      </div>

      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
        <div className='rounded-xl border border-slate-100 bg-white p-4 shadow-sm'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h4 className='font-semibold text-slate-800'>{item.title}</h4>
                <Badge
                  variant='secondary'
                  className={`border-0 text-xs ${config.badge}`}
                >
                  {item.type}
                </Badge>
              </div>

              {item.description ? (
                <p className='mt-1.5 text-sm leading-relaxed text-slate-500'>
                  {item.description}
                </p>
              ) : null}

              <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400'>
                {item.time ? (
                  <span className='flex items-center gap-1'>
                    <Clock className='h-3.5 w-3.5' />
                    {item.time}
                  </span>
                ) : null}

                {item.location ? (
                  <span className='flex items-center gap-1'>
                    <MapPin className='h-3.5 w-3.5' />
                    {item.location}
                  </span>
                ) : null}

                {typeof item.cost === 'number' && item.cost > 0 ? (
                  <span className='flex items-center gap-1'>
                    <DollarSign className='h-3.5 w-3.5' />
                    {item.cost}
                  </span>
                ) : null}

                {item.reservationNumber ? (
                  <span className='flex items-center gap-1'>
                    <Hash className='h-3.5 w-3.5' />
                    {item.reservationNumber}
                  </span>
                ) : null}
              </div>

              {item.notes ? (
                <p className='mt-2 border-l-2 border-slate-200 pl-2 text-xs italic text-slate-400'>
                  {item.notes}
                </p>
              ) : null}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
                >
                  <MoreHorizontal className='h-4 w-4 text-slate-400' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Pencil className='mr-2 h-3.5 w-3.5' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className='text-flag-red-600'
                >
                  <Trash2 className='mr-2 h-3.5 w-3.5' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
