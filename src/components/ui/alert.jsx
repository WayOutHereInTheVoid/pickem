import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} AlertProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'default' | 'destructive'} [variant] - The variant of the alert.
 * @property {React.ReactNode} children - The content of the component.
 */

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * A component that displays a short, important message in a way that attracts the user's attention without interrupting the user's task.
 * @param {AlertProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

/**
 * @typedef {Object} AlertTitleProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The title of the alert.
 * @param {AlertTitleProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

/**
 * @typedef {Object} AlertDescriptionProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The description of the alert.
 * @param {AlertDescriptionProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
