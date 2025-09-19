import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} SeparatorProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'horizontal' | 'vertical'} [orientation='horizontal'] - The orientation of the separator.
 * @property {boolean} [decorative=true] - Whether the separator is decorative.
 */

/**
 * A separator component that can be used to separate content.
 * This component is based on the Radix UI Separator primitive.
 * @param {SeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Separator = React.forwardRef((
  { className, orientation = "horizontal", decorative = true, ...props },
  ref
) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props} />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
