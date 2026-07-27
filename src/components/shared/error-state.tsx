import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <Empty className="border border-dashed py-12">
      <EmptyMedia variant="icon">
        <AlertTriangle />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{message}</EmptyDescription>
      {onRetry && (
        <EmptyContent>
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

export default ErrorState;
