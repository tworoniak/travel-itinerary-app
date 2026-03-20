import { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import TimelineItem from '@/features/itineraries/components/TimelineItem';
import SortableTimelineItem from '@/features/itineraries/components/SortableTimelineItem';
import type { ItineraryItem } from '@/features/itineraries/types/itinerary';
import { parseLocalDate } from '@/features/itineraries/utils/date';

interface DayColumnProps {
  dayNumber: number;
  date: string;
  items: ItineraryItem[];
  onAddItem: () => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (item: ItineraryItem) => void;
  onReorderUntimedItems?: (items: ItineraryItem[]) => void;
}

export default function DayColumn({
  dayNumber,
  date,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onReorderUntimedItems,
}: DayColumnProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const timedItems = [...items]
    .filter((item) => item.time)
    .sort((a, b) => a.time!.localeCompare(b.time!));

  const untimedItems = [...items]
    .filter((item) => !item.time)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const activeItem =
    activeId != null
      ? (untimedItems.find((item) => item.id === activeId) ?? null)
      : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id || !onReorderUntimedItems) return;

    const oldIndex = untimedItems.findIndex((item) => item.id === active.id);
    const newIndex = untimedItems.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(untimedItems, oldIndex, newIndex);
    onReorderUntimedItems(reordered);
  };

  const hasItems = timedItems.length > 0 || untimedItems.length > 0;

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

      {hasItems ? (
        <div>
          {timedItems.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              isLast={
                untimedItems.length === 0 && idx === timedItems.length - 1
              }
            />
          ))}

          {untimedItems.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={untimedItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {untimedItems.map((item, idx) => (
                  <SortableTimelineItem
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    isLast={idx === untimedItems.length - 1}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeItem ? (
                  <div className='w-full rotate-[0.2deg] scale-[1.01] opacity-95 drop-shadow-2xl'>
                    <div className='rounded-xl ring-1 ring-slate-200/80'>
                      <TimelineItem
                        item={activeItem}
                        onEdit={onEditItem}
                        onDelete={onDeleteItem}
                        isLast
                      />
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : null}
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
