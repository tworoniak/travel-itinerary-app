import { MapPin } from 'lucide-react';

const HomeHero = () => {
  return (
    <section className='hero hero-home border-b border-slate-200/70 bg-gradient-to-b from-pumpkin-spice-50 to-white'>
      <div className='mx-auto max-w-6xl px-6 py-16'>
        <div className='mb-10 flex items-end justify-between gap-2'>
          <div>
            <p className='flex gap-1 items-center text-sm font-semibold uppercase tracking-[0.2em] text-secondary'>
              <MapPin size={16} strokeWidth={2} color='hsl(var(--primary))' />
              <span className='bg-gradient-to-r from-pumpkin-spice-500 to-flag-red-500 bg-clip-text text-transparent'>
                Horizons
              </span>
            </p>

            <p className='mt-3 max-w-2xl text-sunflower-gold-200 text-xs italic'>
              Your journey starts here.
            </p>
            <h1 className=' text-4xl font-extrabold tracking-tight text-white'>
              Plan further.{' '}
              <span className='bg-gradient-to-r from-pumpkin-spice-500 to-flag-red-500 bg-clip-text text-transparent'>
                Travel better.
              </span>
            </h1>

            <p className='mt-3 max-w-2xl text-sunflower-gold-200'>
              Create detailed day-by-day itineraries with attractions,
              reservations, and transport &mdash; all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
