import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import type { ItineraryItem } from '@/features/itineraries/types/itinerary';

interface TripCostChartProps {
  items: ItineraryItem[];
}

type CostBucket = {
  name: string;
  value: number;
};

const TYPE_LABELS: Record<string, string> = {
  attraction: 'Attractions',
  restaurant: 'Dining',
  transport: 'Transport',
  flight: 'Flights',
  hotel: 'Hotels',
  activity: 'Activities',
  other: 'Other',
};

const COLORS = [
  '#f97316', // orange-500
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#eab308', // yellow-500
  '#64748b', // slate-500
];

function buildCostData(items: ItineraryItem[]): CostBucket[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const cost = item.cost ?? 0;
    if (cost <= 0) continue;

    const key = item.type || 'other';
    totals.set(key, (totals.get(key) ?? 0) + cost);
  }

  return Array.from(totals.entries())
    .map(([type, value]) => ({
      name: TYPE_LABELS[type] ?? 'Other',
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

function CurrencyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  return (
    <div className='rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md'>
      <p className='text-sm font-medium text-slate-900'>{item.name}</p>
      <p className='text-sm text-slate-600'>${item.value.toLocaleString()}</p>
    </div>
  );
}

function CostLegend({
  payload,
  total,
}: {
  payload?: ReadonlyArray<{
    value?: string;
    color?: string;
    payload?: { name?: string; value?: number };
  }>;
  total: number;
}) {
  if (!payload) return null;

  return (
    <div className='mt-4 grid gap-2 sm:grid-cols-2'>
      {payload.map((entry, index) => {
        const value = entry.payload?.value ?? 0;
        const label = entry.value ?? entry.payload?.name ?? 'Other';
        const color = entry.color ?? '#94a3b8';
        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

        return (
          <div
            key={`${label}-${index}`}
            className='flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm'
          >
            <div className='flex items-center gap-2'>
              <span
                className='h-3 w-3 rounded-full'
                style={{ backgroundColor: color }}
              />
              <span className='text-slate-700'>{label}</span>
            </div>

            <div className='text-right text-slate-500'>
              <span className='font-medium text-slate-900'>
                ${value.toLocaleString()}
              </span>{' '}
              ({percent}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TripCostChart({ items }: TripCostChartProps) {
  const data = buildCostData(items);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <p className='text-sm font-semibold text-slate-700'>Cost Breakdown</p>
        <p className='mt-2 text-sm text-slate-500'>
          Add costs to itinerary items to see a category breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='mb-4'>
        <p className='text-sm font-semibold text-slate-700'>Cost Breakdown</p>
        <p className='mt-1 text-sm text-slate-500'>
          Planned spending by activity type.
        </p>
      </div>

      <div className='h-[400px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={70}
              outerRadius={110}
              paddingAngle={1}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<CurrencyTooltip />} />
            <Legend
              verticalAlign='bottom'
              content={(props) => <CostLegend {...props} total={total} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
