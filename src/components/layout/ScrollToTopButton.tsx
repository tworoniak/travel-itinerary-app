import { useScrollPosition } from '../../hooks/useScrollPosition';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const isVisible = useScrollPosition(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top flex items-center justify-center fixed bottom-16 right-4 w-10 h-10 rounded-full cursor-pointer border border-secondary/60 z-10 bg-primary text-white hover:-translate-y-1 transition duration-300  ${isVisible ? 'opacity-1 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-label='Scroll to top'
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
