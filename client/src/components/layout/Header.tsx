import { Link } from 'react-router-dom';
import { Map, Plus, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md print:hidden'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
        <Link
          to='/'
          className='flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900'
        >
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600'>
            <Plane className='h-4 w-4' />
          </div>
          <div className='flex flex-col leading-none'>
            <span>Voyage Planner</span>
            <span className='text-[11px] font-medium text-slate-500 mt-1'>
              Travel itinerary builder
            </span>
          </div>
        </Link>

        <div className='flex items-center gap-2'>
          <Link to='/'>
            <Button variant='ghost' className='hidden sm:inline-flex'>
              <Map className='h-4 w-4' />
              My Trips
            </Button>
          </Link>

          <Link to='/itinerary/new'>
            <Button className='bg-orange-500 hover:bg-orange-600'>
              <Plus className='h-4 w-4' />
              New itinerary
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
