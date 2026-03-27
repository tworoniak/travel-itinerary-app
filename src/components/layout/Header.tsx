import { Link } from 'react-router-dom';
import { Map, Plus, Plane, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const avatarLetter = user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className='sticky top-0 z-40 border-b border-deep-space-blue-200/50 bg-deep-space-blue-900/95 backdrop-blur-md print:hidden'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900'
        >
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-deep-space-blue-700 text-deep-space-blue-200 border border-deep-space-blue-300'>
            <Plane size={24} strokeWidth={1} />
            {/* 🌎 */}
          </div>
          <div className='flex flex-col items-start leading-none'>
            <span className='text-deep-space-blue-200 text-lg -mt-1'>
              Horizons
            </span>
            <span className='text-[11px] font-medium text-sunflower-gold-300 -mt-1'>
              Travel itinerary builder
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className='hidden sm:flex items-center gap-2'>
          <Link
            to='/'
            // className='text-deep-space-blue-200 hover:text-deep-space-blue-800'
          >
            <Button variant='header'>
              <Map className='h-4 w-4' />
              My Trips
            </Button>
          </Link>

          <Link to='/itinerary/new'>
            <Button className='bg-pumpkin-spice-500 hover:bg-pumpkin-spice-600'>
              <Plus className='h-4 w-4' />
              New itinerary
            </Button>
          </Link>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-1.5 ml-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-spice-400'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-deep-space-blue-700 text-white text-lg font-semibold'>
                  {avatarLetter}
                </div>
                {/* <ChevronDown className='h-3.5 w-3.5 text-slate-500' /> */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52'>
              <div className='px-2 py-2'>
                <p className='text-xs font-medium text-slate-500'>
                  Signed in as
                </p>
                <p className='text-sm font-semibold text-slate-900 truncate'>
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className='gap-2 text-slate-500'>
                <User className='h-4 w-4' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className='gap-2 text-flag-red-600 focus:text-flag-red-600 focus:bg-flag-red-50 cursor-pointer'
              >
                <LogOut className='h-4 w-4' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: hamburger */}
        <button
          className='sm:hidden flex items-center justify-center h-9 w-9 rounded-lg text-deep-space-blue-200 hover:bg-sunflower-gold-500 hover:text-deep-space-blue-900'
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label='Toggle menu'
        >
          {mobileOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <Menu className='h-5 w-5' />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='sm:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-1'>
          {/* User info */}
          <div className='flex items-center gap-3 pb-3 mb-2 border-b border-slate-100'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-pumpkin-spice-500 text-white text-sm font-semibold'>
              {avatarLetter}
            </div>
            <div className='flex flex-col leading-none'>
              <span className='text-xs text-slate-500'>Signed in as</span>
              <span className='text-sm font-semibold text-slate-900 truncate max-w-[200px]'>
                {user?.email}
              </span>
            </div>
          </div>

          <Link
            to='/'
            onClick={() => setMobileOpen(false)}
            className='flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100'
          >
            <Map className='h-4 w-4' />
            My Trips
          </Link>

          <Link
            to='/itinerary/new'
            onClick={() => setMobileOpen(false)}
            className='flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100'
          >
            <Plus className='h-4 w-4' />
            New itinerary
          </Link>

          <button
            onClick={handleSignOut}
            className='flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-flag-red-600 hover:bg-flag-red-50'
          >
            <LogOut className='h-4 w-4' />
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
