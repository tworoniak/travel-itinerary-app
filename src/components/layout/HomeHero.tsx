import { MapPin } from 'lucide-react';

const HomeHero = () => {
  return (
    <section className='hero hero-home relative border-b border-slate-200/70 bg-gradient-to-b from-deep-space-blue-900 to-deep-space-blue-600'>
      <div className='absolute top-0 left-0 right-0 w-full h-full bg-gradient-to-b from-deep-space-blue-900/40 to-black/70'></div>
      <div className='mx-auto max-w-6xl px-6 py-16'>
        <div className='relative z-10 mb-10 flex items-end justify-between gap-2'>
          <div>
            <p className='flex gap-1 items-center text-sm font-semibold uppercase tracking-[0.2em] text-secondary'>
              <MapPin size={16} strokeWidth={2} color='#33b8ff' />
              <span className='bg-gradient-to-r from-deep-space-blue-200 to-deep-space-blue-500 bg-clip-text text-transparent'>
                Horizons
              </span>
            </p>

            <p className='mt-3 max-w-2xl text-sunflower-gold-200 text-xs italic'>
              Your journey starts here.
            </p>
            <h1 className=' text-4xl font-extrabold tracking-tight text-white'>
              Plan further. <br className='block sm:hidden' />
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
