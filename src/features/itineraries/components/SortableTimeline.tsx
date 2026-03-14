import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import TimelineItem from '@/features/itineraries/components/TimelineItem';
import type { ItineraryItem } from '@/features/itineraries/types/itinerary';

interface SortableTimelineItemProps {
  item: ItineraryItem;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
  isLast: boolean;
}

export default function SortableTimelineItem({
  item,
  onEdit,
  onDelete,
  isLast,
}: SortableTimelineItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className='relative'>
      <div
        {...attributes}
        {...listeners}
        className='absolute right-12 top-4 z-10 cursor-grab rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        aria-label='Drag to reorder'
      >
        <GripVertical className='h-4 w-4' />
      </div>

      <TimelineItem
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        isLast={isLast}
      />
    </div>
  );
}
