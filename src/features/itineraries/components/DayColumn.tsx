import { format } from 'date-fns';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import TimelineItem from '@/features/itineraries/components/TimelineItem';
import type { ItineraryItem } from '@/features/itineraries/types/itinerary';
import { parseLocalDate } from '@/features/itineraries/utils/date';

interface DayColumnProps {
  dayNumber: number;
  date: string;
  items: ItineraryItem[];
  onAddItem: () => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (item: ItineraryItem) => void;
}

export default function DayColumn({
  dayNumber,
  date,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: DayColumnProps) {
  const sortedItems = [...items].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <div>
          <span className='text-xs font-semibold uppercase tracking-widest text-orange-500'>
            Day {dayNumber}
          </span>
          <h3 className='mt-0.5 text-lg font-bold text-slate-800'>
            {format(parseLocalDate(date), 'EEEE, MMMM d')}
          </h3>
        </div>

        <Button
          size='sm'
          variant='outline'
          onClick={onAddItem}
          className='border-dashed text-sm'
        >
          <Plus className='mr-1 h-4 w-4' />
          Add
        </Button>
      </div>

      {sortedItems.length > 0 ? (
        <div>
          {sortedItems.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              isLast={idx === sortedItems.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className='rounded-xl border-2 border-dashed border-slate-200 p-8 text-center'>
          <p className='text-sm text-slate-400'>No activities planned yet</p>
          <Button
            size='sm'
            variant='ghost'
            onClick={onAddItem}
            className='mt-2 text-orange-500 hover:text-orange-600'
          >
            <Plus className='mr-1 h-4 w-4' />
            Add your first activity
          </Button>
        </div>
      )}
    </div>
  );
}
