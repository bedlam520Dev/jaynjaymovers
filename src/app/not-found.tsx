import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
        <Truck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-display text-7xl font-bold text-primary mb-2">404</h1>
      <h2 className="font-display text-2xl font-semibold mb-3">This page took a wrong turn</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been moved, deleted, or possibly never existed.
      </p>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/quote">Get a Free Quote</Link>
        </Button>
      </div>
    </div>
  );
}
