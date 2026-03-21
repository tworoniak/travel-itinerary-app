import type { Itinerary } from '@/features/itineraries/types/itinerary';

export const statusStyles: Record<Itinerary['status'], string> = {
  planning:
    'bg-pumpkin-spice-100 text-pumpkin-spice-700 border-pumpkin-spice-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inProgress:
    'bg-deep-space-blue-50 text-deep-space-blue-700 border-deep-space-blue-200',
  completed: 'bg-slate-50 text-slate-500 border-slate-200',
};
