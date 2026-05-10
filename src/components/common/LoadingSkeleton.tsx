import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function TripCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full bg-muted" />
      <CardContent className="flex-1 p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-2/3 bg-muted" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2 bg-muted" />
          <Skeleton className="h-4 w-1/3 bg-muted" />
          <Skeleton className="h-4 w-2/5 bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2 mt-auto shrink-0">
        <Skeleton className="h-10 flex-1 bg-muted" />
        <Skeleton className="h-10 w-10 bg-muted" />
      </CardFooter>
    </Card>
  );
}

export function ActivityCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full bg-muted" />
      <CardContent className="flex-1 p-6 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-5/6 bg-muted" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-muted" />
          <Skeleton className="h-6 w-20 bg-muted" />
          <Skeleton className="h-6 w-14 bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto shrink-0">
        <Skeleton className="h-10 w-full bg-muted" />
      </CardFooter>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-muted" />
        <Skeleton className="h-5 w-96 bg-muted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
