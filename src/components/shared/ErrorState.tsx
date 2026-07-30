import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h3 className="text-lg font-semibold">Error</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
