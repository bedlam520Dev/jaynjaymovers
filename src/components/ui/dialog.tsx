"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{ open: boolean; onOpenChange: (o: boolean) => void }>({
  open: false,
  onOpenChange: () => {},
});

function Dialog({ open: openProp, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;
  const onOpenChangeFn = onOpenChange ?? setInternalOpen;
  return (
    <DialogContext.Provider value={{ open, onOpenChange: onOpenChangeFn }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: any) => void }>, {
      onClick: (e: any) => {
        (children as React.ReactElement<{ onClick?: (e: any) => void }>).props.onClick?.(e);
        onOpenChange(true);
      },
    });
  }
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, onOpenChange } = React.useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className={cn(
        "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-xl animate-scale-in",
        className,
      )}>
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          onClick={() => onOpenChange(false)}
        >
          <span className="sr-only">Close</span>✕
        </button>
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-display text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
