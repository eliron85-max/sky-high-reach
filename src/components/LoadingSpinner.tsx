import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-gold" />
        <p className="text-muted-foreground text-sm">טוען...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
