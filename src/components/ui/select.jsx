import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A select component that allows users to select an option from a list.
 * This component is based on the Radix UI Select primitive.
 */
const Select = SelectPrimitive.Root

/**
 * A group of select items.
 */
const SelectGroup = SelectPrimitive.Group

/**
 * The value of the selected item.
 */
const SelectValue = SelectPrimitive.Value

/**
 * @typedef {Object} SelectTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The trigger that opens the select menu.
 * @param {SelectTriggerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * @typedef {Object} SelectScrollUpButtonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * The button that scrolls the select menu up.
 * @param {SelectScrollUpButtonProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * @typedef {Object} SelectScrollDownButtonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * The button that scrolls the select menu down.
 * @param {SelectScrollDownButtonProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/**
 * @typedef {Object} SelectContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 * @property {'popper'} [position='popper'] - The position of the content.
 */

/**
 * The content of the select menu.
 * @param {SelectContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("p-1", position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * @typedef {Object} SelectLabelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A label for a group of select items.
 * @param {SelectLabelProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * @typedef {Object} SelectItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in a select menu.
 * @param {SelectItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * @typedef {Object} SelectSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A separator between select items.
 * @param {SelectSeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
