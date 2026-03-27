import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  let message = 'Something went wrong. Please try again.';
  if (isRouteErrorResponse(error)) {
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center'>
      <h2 className='text-2xl font-semibold'>Oops, something went wrong</h2>
      <p className='text-muted-foreground max-w-md text-sm'>{message}</p>
      <div className='flex gap-3'>
        <Button variant='outline' onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button asChild>
          <Link to='/'>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
