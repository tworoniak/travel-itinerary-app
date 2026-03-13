import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomeHero from '@/components/layout/HomeHero';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { Toaster } from '@/components/ui/sonner';

export default function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 text-slate-900'>
      <ScrollToTop />
      <Header />

      <main className='flex-1'>
        {isHome ? <HomeHero /> : null}
        <Outlet />
      </main>

      <Footer />
      <ScrollToTopButton />
      <Toaster />
    </div>
  );
}
