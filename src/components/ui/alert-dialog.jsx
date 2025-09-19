import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * @typedef {Object} AlertDialogProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A modal dialog that interrupts the user with important content and expects a response.
 * @param {AlertDialogProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialog = AlertDialogPrimitive.Root

/**
 * The button that opens the alert dialog.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * A portal that renders its children into a new stacking context.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * @typedef {Object} AlertDialogOverlayProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A layer that covers the inert portion of the view when the alert dialog is open.
 * @param {AlertDialogOverlayProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref} />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * @typedef {Object} AlertDialogContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The main content of the alert dialog.
 * @param {AlertDialogContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props} />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * @typedef {Object} AlertDialogHeaderProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The header of the alert dialog.
 * @param {AlertDialogHeaderProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

/**
 * @typedef {Object} AlertDialogFooterProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The footer of the alert dialog.
 * @param {AlertDialogFooterProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

/**
 * @typedef {Object} AlertDialogTitleProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The title of the alert dialog.
 * @param {AlertDialogTitleProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * @typedef {Object} AlertDialogDescriptionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The description of the alert dialog.
 * @param {AlertDialogDescriptionProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * @typedef {Object} AlertDialogActionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The action button of the alert dialog.
 * @param {AlertDialogActionProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * @typedef {Object} AlertDialogCancelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The cancel button of the alert dialog.
 * @param {AlertDialogCancelProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props} />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
