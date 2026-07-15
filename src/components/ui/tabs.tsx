"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({ value: "", setValue: () => {} });

function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ctx.value === value ? "bg-background text-foreground shadow-sm" : "",
        className,
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={cn("mt-2", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
