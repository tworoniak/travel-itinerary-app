import { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  DollarSign,
  Loader2,
  AlertCircle,
} from 'lucide-react';

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
  generateSuggestions,
  type SuggestedActivity,
} from '@/features/itineraries/utils/suggestions';

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
  const [suggestions, setSuggestions] = useState<SuggestedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayCount =
    Math.floor(
      (new Date(itinerary.endDate).getTime() -
        new Date(itinerary.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const existingTitles = itinerary.items.map((item) => item.title);

  useEffect(() => {
    if (!open) return;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      setSuggestions([]);

      try {
        const results = await generateSuggestions(
          itinerary.destination,
          existingTitles,
        );
        setSuggestions(results);
      } catch {
        setError('Failed to load suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetch();
  }, [open, itinerary.destination]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-orange-500' />
            Suggested Activities
          </DialogTitle>
          <DialogDescription>
            AI-powered suggestions for {itinerary.destination}. Choose a day and
            add suggestions directly to your itinerary.
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

          {/* Loading */}
          {isLoading && (
            <div className='flex flex-col items-center justify-center gap-3 py-12 text-slate-500'>
              <Loader2 className='h-6 w-6 animate-spin text-orange-500' />
              <p className='text-sm'>
                Generating suggestions for {itinerary.destination}...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className='flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
              <AlertCircle className='h-4 w-4 shrink-0' />
              {error}
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && !error && suggestions.length > 0 && (
            <div className='grid gap-4'>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                >
                  <div className='grid grid-cols-1 gap-8 md:grid-cols-[1fr_100px]'>
                    <div className='flex flex-row gap-8'>
                      <div className='mt-0.5 flex h-9 w-9 items-center justify-center self-center rounded-full bg-slate-100'>
                        <ActivityTypeIcon
                          type={suggestion.type}
                          className='h-4 w-4 text-slate-700'
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

                    <Button
                      onClick={() =>
                        onAddSuggestion(suggestion, Number(selectedDay))
                      }
                      className='self-center bg-orange-500 hover:bg-orange-600'
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className='mt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
