import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A dropdown menu component that displays a menu of actions when a user clicks on a trigger.
 * This component is based on the Radix UI Dropdown Menu primitive.
 */
const DropdownMenu = DropdownMenuPrimitive.Root

/**
 * The trigger that opens the dropdown menu.
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

/**
 * A group of dropdown menu items.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group

/**
 * A portal that renders its children into a new stacking context.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

/**
 * A submenu that is displayed when a user hovers over a dropdown menu item.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub

/**
 * A group of radio buttons that can be used in a dropdown menu.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * @typedef {Object} DropdownMenuSubTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The trigger that opens a submenu.
 * @param {DropdownMenuSubTriggerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

/**
 * @typedef {Object} DropdownMenuSubContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of a submenu.
 * @param {DropdownMenuSubContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

/**
 * @typedef {Object} DropdownMenuContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {number} [sideOffset=4] - The offset of the content from the trigger.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of the dropdown menu.
 * @param {DropdownMenuContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

/**
 * @typedef {Object} DropdownMenuItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in the dropdown menu.
 * @param {DropdownMenuItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

/**
 * @typedef {Object} DropdownMenuCheckboxItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [checked] - Whether the item is checked.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A checkbox item in the dropdown menu.
 * @param {DropdownMenuCheckboxItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

/**
 * @typedef {Object} DropdownMenuRadioItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A radio button item in the dropdown menu.
 * @param {DropdownMenuRadioItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

/**
 * @typedef {Object} DropdownMenuLabelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A label for a group of dropdown menu items.
 * @param {DropdownMenuLabelProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props} />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

/**
 * @typedef {Object} DropdownMenuSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A separator between dropdown menu items.
 * @param {DropdownMenuSeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

/**
 * @typedef {Object} DropdownMenuShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A keyboard shortcut for a dropdown menu item.
 * @param {DropdownMenuShortcutProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props} />)
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
