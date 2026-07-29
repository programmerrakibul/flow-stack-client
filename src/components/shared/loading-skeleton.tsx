import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "stats";
  rows?: number;
}

const StatsSkeleton = () => (
  <div
    className="grid gap-4 grid-cols-1
   md:grid-cols-2 lg:grid-cols-4"
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-4">
    <div className="flex gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="rounded-none border">
      <div className="flex gap-4 border-b p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b p-3 last:border-0">
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const CardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: rows }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const LoadingSkeleton = ({ variant = "card", rows }: LoadingSkeletonProps) => {
  switch (variant) {
    case "stats":
      return <StatsSkeleton />;
    case "table":
      return <TableSkeleton rows={rows} />;
    case "card":
    default:
      return <CardSkeleton rows={rows} />;
  }
};

export default LoadingSkeleton;
