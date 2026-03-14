import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export function toastSuccess(title: string, description?: string) {
  toast.success(title, {
    description,
    icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
  });
}

export function toastError(title: string, description?: string) {
  toast.error(title, {
    description,
    icon: <XCircle className="h-4 w-4 text-red-600" />,
  });
}

export function toastWarning(title: string, description?: string) {
  toast.warning(title, {
    description,
    icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  });
}

export function toastInfo(title: string, description?: string) {
  toast(title, {
    description,
    icon: <Info className="h-4 w-4 text-blue-600" />,
  });
}