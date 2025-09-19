import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
})

/**
 * @typedef {Object} ToggleGroupProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'default' | 'outline'} [variant] - The variant of the toggle group.
 * @property {'default' | 'sm' | 'lg'} [size] - The size of the toggle group.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A group of toggle buttons.
 * This component is based on the Radix UI Toggle Group primitive.
 * @param {ToggleGroupProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

/**
 * @typedef {Object} ToggleGroupItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'default' | 'outline'} [variant] - The variant of the toggle item.
 * @property {'default' | 'sm' | 'lg'} [size] - The size of the toggle item.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in a toggle group.
 * @param {ToggleGroupItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    (<ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleVariants({
        variant: context.variant || variant,
        size: context.size || size,
      }), className)}
      {...props}>
      {children}
    </ToggleGroupPrimitive.Item>)
  );
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
