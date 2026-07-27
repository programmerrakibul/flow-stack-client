import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";

import { cn } from "@/utils/utils";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="alert-dialog-close" {...props} />;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <DialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:max-w-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="alert-dialog-action"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
