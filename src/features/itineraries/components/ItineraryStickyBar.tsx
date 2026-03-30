import { Link } from 'react-router-dom';
import {
  MoreHorizontal,
  Printer,
  ChevronDown,
  Copy,
  Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { format, parseISO, isToday } from 'date-fns';

interface ItineraryStickyBarProps {
  itineraryId: string;
  title: string;
  startLabel: string;
  endLabel: string;
  totalCost: number;
  days: { dayNumber: number; date: string }[];
  onAddActivity: () => void;
  onSuggestActivities: () => void;
  onDuplicateTrip: () => void;
  onShareTrip: () => void;
  onDeleteTrip: () => void;
}

export default function ItineraryStickyBar({
  itineraryId,
  title,
  startLabel,
  endLabel,
  totalCost,
  days,
  onAddActivity,
  onSuggestActivities,
  onDuplicateTrip,
  onShareTrip,
  onDeleteTrip,
}: ItineraryStickyBarProps) {
  return (
    <section className='sticky top-16 z-30 mt-8 bg-white/90 px-4 py-3 backdrop-blur shadow-sm print:hidden md:px-6'>
      <div className='mx-auto flex max-w-6xl flex-col gap-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-900'>
              {title}
            </p>
            <p className='text-xs text-slate-500'>
              {startLabel} — {endLabel}
            </p>
          </div>

          <div className='shrink-0 text-right'>
            <p className='text-xs text-slate-400'>Planned</p>
            <p className='text-sm font-semibold text-slate-900'>
              ${totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Mobile */}
        <div className='flex items-center gap-2 lg:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex-1 bg-pumpkin-spice-500 hover:bg-pumpkin-spice-600'>
                Add Activity
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='start'>
              {days.map((day) => {
                const date = parseISO(day.date);

                return (
                  <DropdownMenuItem
                    key={day.dayNumber}
                    onClick={onAddActivity}
                    className='flex items-center justify-between gap-4'
                  >
                    <span>Day {day.dayNumber}</span>

                    <span className='text-xs text-slate-400'>
                      {format(date, 'EEE, MMM d')}
                      {isToday(date) && (
                        <span className='ml-2 text-pumpkin-spice-500 font-medium'>
                          Today
                        </span>
                      )}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' aria-label='More actions'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={onSuggestActivities}>
                Suggest Activities
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onDuplicateTrip}>
                <Copy className='h-4 w-4' />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onShareTrip}>
                <Share2 className='h-4 w-4' />
                Share
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={`/itinerary/${itineraryId}/edit`}>Edit Trip</Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => window.print()}>
                Print / PDF
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className='text-flag-red-600 focus:text-flag-red-700'
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete Trip
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete itinerary?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{title}" and all of its
                      activities. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-flag-red-600 hover:bg-flag-red-700'
                      onClick={onDeleteTrip}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop */}
        <div className='hidden items-center justify-end gap-3 lg:flex'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='bg-pumpkin-spice-500 hover:bg-pumpkin-spice-600'>
                Add Activity
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='start'>
              {days.map((day) => {
                const date = parseISO(day.date);

                return (
                  <DropdownMenuItem
                    key={day.dayNumber}
                    onClick={onAddActivity}
                    className='flex items-center justify-between gap-4'
                  >
                    <span>Day {day.dayNumber}</span>

                    <span className='text-xs text-slate-400'>
                      {format(date, 'EEE, MMM d')}
                      {isToday(date) && (
                        <span className='ml-2 text-pumpkin-spice-500 font-medium'>
                          Today
                        </span>
                      )}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant='outline' onClick={onSuggestActivities}>
            Suggest Activities
          </Button>

          <Button variant='outline' onClick={onDuplicateTrip}>
            <Copy className='h-4 w-4' />
            Duplicate
          </Button>

          <Button variant='outline' onClick={onShareTrip}>
            <Share2 className='h-4 w-4' />
            Share
          </Button>

          <Link to={`/itinerary/${itineraryId}/edit`}>
            <Button variant='outline'>Edit Trip</Button>
          </Link>

          <Button variant='outline' onClick={() => window.print()}>
            <Printer className='h-4 w-4' />
            Print / PDF
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                className='border-flag-red-200 text-flag-red-600 hover:bg-flag-red-50 hover:text-flag-red-700'
              >
                Delete Trip
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete itinerary?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{title}" and all of its
                  activities. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className='bg-flag-red-600 hover:bg-flag-red-700'
                  onClick={onDeleteTrip}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
