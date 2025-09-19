import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A context menu component that displays a menu of actions when a user right-clicks on a component.
 * This component is based on the Radix UI Context Menu primitive.
 */
const ContextMenu = ContextMenuPrimitive.Root

/**
 * The trigger that opens the context menu.
 */
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

/**
 * A group of context menu items.
 */
const ContextMenuGroup = ContextMenuPrimitive.Group

/**
 * A portal that renders its children into a new stacking context.
 */
const ContextMenuPortal = ContextMenuPrimitive.Portal

/**
 * A submenu that is displayed when a user hovers over a context menu item.
 */
const ContextMenuSub = ContextMenuPrimitive.Sub

/**
 * A group of radio buttons that can be used in a context menu.
 */
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

/**
 * @typedef {Object} ContextMenuSubTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The trigger that opens a submenu.
 * @param {ContextMenuSubTriggerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

/**
 * @typedef {Object} ContextMenuSubContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of a submenu.
 * @param {ContextMenuSubContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

/**
 * @typedef {Object} ContextMenuContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of the context menu.
 * @param {ContextMenuContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

/**
 * @typedef {Object} ContextMenuItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in the context menu.
 * @param {ContextMenuItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

/**
 * @typedef {Object} ContextMenuCheckboxItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [checked] - Whether the item is checked.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A checkbox item in the context menu.
 * @param {ContextMenuCheckboxItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

/**
 * @typedef {Object} ContextMenuRadioItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A radio button item in the context menu.
 * @param {ContextMenuRadioItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

/**
 * @typedef {Object} ContextMenuLabelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A label for a group of context menu items.
 * @param {ContextMenuLabelProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props} />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

/**
 * @typedef {Object} ContextMenuSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A separator between context menu items.
 * @param {ContextMenuSeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props} />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

/**
 * @typedef {Object} ContextMenuShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A keyboard shortcut for a context menu item.
 * @param {ContextMenuShortcutProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ContextMenuShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props} />)
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
