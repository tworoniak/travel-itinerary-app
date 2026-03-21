import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm !text-slate-900',
          actionButton:
            'bg-pumpkin-spice-500 text-white hover:bg-pumpkin-spice-600',
          cancelButton: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          success: '!border-emerald-200 !bg-emerald-50 !text-emerald-900',
          error: '!border-flag-red-200 !bg-flag-red-50 !text-flag-red-900',
          warning: '!border-amber-200 !bg-amber-50 !text-amber-900',
          info: '!border-blue-200 !bg-blue-50 !text-blue-900',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
