import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className='flex min-h-svh items-center justify-center bg-background'>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    </div>
  );
}
