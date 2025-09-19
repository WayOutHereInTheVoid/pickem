import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} ProgressProps
 * @property {string} [className] - Additional class names for styling.
 * @property {number} value - The current value of the progress bar.
 */

/**
 * A progress bar component that shows the progress of a task.
 * This component is based on the Radix UI Progress primitive.
 * @param {ProgressProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
