import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * A popover component that displays a popover when a user clicks on a trigger.
 * This component is based on the Radix UI Popover primitive.
 */
const Popover = PopoverPrimitive.Root

/**
 * The trigger that opens the popover.
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * @typedef {Object} PopoverContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'center' | 'start' | 'end'} [align='center'] - The alignment of the content.
 * @property {number} [sideOffset=4] - The offset of the content from the trigger.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of the popover.
 * @param {PopoverContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
