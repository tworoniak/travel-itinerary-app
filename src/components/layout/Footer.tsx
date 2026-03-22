const Footer = () => {
  return (
    <footer className='border-t border-slate-200 bg-deep-space-blue-900 print:hidden'>
      <div className='flex justify-between mx-auto max-w-6xl px-6 py-4 text-sm text-sunflower-gold-300'>
        <p>
          Horizons{' '}
          <span className='hidden md:inline-block'>
            — <em>Plan further. Travel better.</em>
          </span>
        </p>
        <p>&copy; {new Date().getFullYear()} Woroniak.dev</p>
      </div>
    </footer>
  );
};

export default Footer;
