import { Card } from '@/components/ui/card';

export default function ItineraryCardSkeleton() {
  return (
    <Card className='overflow-hidden border-0 bg-white shadow-md'>
      {/* Image area */}
      <div className='relative h-48 bg-slate-200 animate-pulse' />

      <div className='p-4 space-y-3'>
        {/* Date + travelers row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='h-3.5 w-32 rounded-full bg-slate-200 animate-pulse' />
            <div className='h-3.5 w-6 rounded-full bg-slate-200 animate-pulse' />
          </div>
          <div className='h-3.5 w-10 rounded-full bg-slate-200 animate-pulse' />
        </div>

        {/* Hover row placeholder */}
        <div className='h-3.5 w-24 rounded-full bg-slate-200 animate-pulse' />
      </div>
    </Card>
  );
}
