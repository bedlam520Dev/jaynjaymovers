"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="font-display text-2xl font-semibold mb-3">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. Please try again, or contact us if the problem persists.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} size="lg">Try Again</Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
