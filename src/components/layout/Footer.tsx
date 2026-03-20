const Footer = () => {
  return (
    <footer className='border-t border-slate-200 bg-white/70 print:hidden'>
      <div className='flex justify-between mx-auto max-w-6xl px-6 py-4 text-sm text-slate-500'>
        <p>
          Horizons{' '}
          <span className='hidden md:inline-block'>
            — React, TypeScript, Tailwind, and thoughtful UX.
          </span>
        </p>
        <p>&copy; {new Date().getFullYear()} Woroniak.dev</p>
      </div>
    </footer>
  );
};

export default Footer;
