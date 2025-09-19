import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} InputProps
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [type] - The type of the input.
 */

/**
 * A standard input component.
 * @param {InputProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
