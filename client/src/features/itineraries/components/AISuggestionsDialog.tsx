import { useMemo, useState } from 'react';
import { Sparkles, MapPin, DollarSign } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ActivityTypeIcon from '@/features/itineraries/components/ActivityTypeIcon';

import type { Itinerary } from '@/features/itineraries/types/itinerary';
import {
  getMockSuggestions,
  type SuggestedActivity,
} from '@/features/itineraries/utils/mockSuggestions';

interface AISuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itinerary: Itinerary;
  onAddSuggestion: (suggestion: SuggestedActivity, dayNumber: number) => void;
}

export default function AISuggestionsDialog({
  open,
  onOpenChange,
  itinerary,
  onAddSuggestion,
}: AISuggestionsDialogProps) {
  const [selectedDay, setSelectedDay] = useState('1');

  const dayCount =
    Math.floor(
      (new Date(itinerary.endDate).getTime() -
        new Date(itinerary.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const suggestions = useMemo(
    () => getMockSuggestions(itinerary.destination),
    [itinerary.destination],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            Suggested Activities
          </DialogTitle>
          <DialogDescription>
            Mock AI-powered suggestions for {itinerary.destination}. Choose a
            day and add suggestions directly to your itinerary.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='max-w-xs space-y-2'>
            <label className='text-sm font-medium text-slate-700'>
              Add to day
            </label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder='Select a day' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: dayCount }, (_, i) => i + 1).map(
                  (day) => (
                    <SelectItem key={day} value={String(day)}>
                      Day {day}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-4'>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.title}
                className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
              >
                <div className='grid grid-cols-1 md:grid-cols-[1fr_100px] gap-8'>
                  <div className='flex flex-row gap-8'>
                    <div className='mt-0.5 flex h-9 w-9 items-center justify-center self-center rounded-full bg-slate-100'>
                      <ActivityTypeIcon
                        type={suggestion.type}
                        className='h-4 w-4  text-slate-700'
                      />
                    </div>
                    <div>
                      <h3 className='text-base font-semibold text-slate-900'>
                        {suggestion.title}
                      </h3>

                      {suggestion.description ? (
                        <p className='mt-1 text-sm text-slate-600'>
                          {suggestion.description}
                        </p>
                      ) : null}

                      <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                        <span className='rounded-full bg-slate-100 px-2 py-1 capitalize text-slate-700'>
                          {suggestion.type}
                        </span>

                        {suggestion.location ? (
                          <span className='inline-flex items-center gap-1'>
                            <MapPin className='h-3.5 w-3.5' />
                            {suggestion.location}
                          </span>
                        ) : null}

                        {typeof suggestion.cost === 'number' ? (
                          <span className='inline-flex items-center gap-1'>
                            <DollarSign className='h-3.5 w-3.5' />
                            {suggestion.cost}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* <div></div> */}
                  <Button
                    onClick={() =>
                      onAddSuggestion(suggestion, Number(selectedDay))
                    }
                    className='bg-orange-500 hover:bg-orange-600 self-center'
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
