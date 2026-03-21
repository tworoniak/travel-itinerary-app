import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type NotifyOptions = {
  description?: string;
  duration?: number;
};

export const notify = {
  success(title: string, options?: NotifyOptions) {
    toast.success(title, {
      description: options?.description,
      duration: options?.duration ?? 3000,
      icon: <CheckCircle2 className='h-4 w-4 text-emerald-600' />,
    });
  },

  error(title: string, options?: NotifyOptions) {
    toast.error(title, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      icon: <XCircle className='h-4 w-4 text-flag-red-600' />,
    });
  },

  warning(title: string, options?: NotifyOptions) {
    toast.warning(title, {
      description: options?.description,
      duration: options?.duration ?? 3500,
      icon: <AlertTriangle className='h-4 w-4 text-amber-600' />,
    });
  },

  info(title: string, options?: NotifyOptions) {
    toast(title, {
      description: options?.description,
      duration: options?.duration ?? 3000,
      icon: <Info className='h-4 w-4 text-blue-600' />,
    });
  },
};
