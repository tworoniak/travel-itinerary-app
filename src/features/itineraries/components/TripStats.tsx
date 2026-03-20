import { Landmark, UtensilsCrossed, Plane, DollarSign } from 'lucide-react';
import type { ItineraryItem } from '@/features/itineraries/types/itinerary';

interface TripStatsProps {
  items: ItineraryItem[];
}

export default function TripStats({ items }: TripStatsProps) {
  const attractions = items.filter((i) => i.type === 'attraction').length;
  const restaurants = items.filter((i) => i.type === 'restaurant').length;
  const transports = items.filter((i) =>
    ['transport', 'flight'].includes(i.type),
  ).length;
  const totalCost = items.reduce((sum, i) => sum + (i.cost || 0), 0);

  const stats = [
    {
      label: 'Attractions',
      value: attractions,
      icon: Landmark,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      label: 'Dining',
      value: restaurants,
      icon: UtensilsCrossed,
      color: 'text-orange-500 bg-orange-50',
    },
    {
      label: 'Transport',
      value: transports,
      icon: Plane,
      color: 'text-teal-500 bg-teal-50',
    },
    {
      label: 'Est. Cost',
      value: `$${totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-50',
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
      {stats.map((s) => (
        <div
          key={s.label}
          className='rounded-xl border border-slate-100 bg-white p-4 text-center'
        >
          <div
            className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}
          >
            <s.icon className='h-4.5 w-4.5' />
          </div>
          <p className='mt-2 text-lg font-bold text-slate-800'>{s.value}</p>
          <p className='text-xs text-slate-400'>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
