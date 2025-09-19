import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A menu within a menubar.
 */
const MenubarMenu = MenubarPrimitive.Menu

/**
 * A group of menubar items.
 */
const MenubarGroup = MenubarPrimitive.Group

/**
 * A portal that renders its children into a new stacking context.
 */
const MenubarPortal = MenubarPrimitive.Portal

/**
 * A submenu that is displayed when a user hovers over a menubar item.
 */
const MenubarSub = MenubarPrimitive.Sub

/**
 * A group of radio buttons that can be used in a menubar.
 */
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

/**
 * @typedef {Object} MenubarProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A menubar component that displays a menu of commands.
 * This component is based on the Radix UI Menubar primitive.
 * @param {MenubarProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props} />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

/**
 * @typedef {Object} MenubarTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The trigger that opens a menubar menu.
 * @param {MenubarTriggerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props} />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

/**
 * @typedef {Object} MenubarSubTriggerProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The trigger that opens a submenu.
 * @param {MenubarSubTriggerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

/**
 * @typedef {Object} MenubarSubContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of a submenu.
 * @param {MenubarSubContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props} />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

/**
 * @typedef {Object} MenubarContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {'start' | 'center' | 'end'} [align='start'] - The alignment of the content.
 * @property {number} [alignOffset=-4] - The offset of the content from the trigger.
 * @property {number} [sideOffset=8] - The offset of the content from the trigger.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of a menubar menu.
 * @param {MenubarContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarContent = React.forwardRef((
  { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
  ref
) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props} />
  </MenubarPrimitive.Portal>
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

/**
 * @typedef {Object} MenubarItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in a menubar menu.
 * @param {MenubarItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

/**
 * @typedef {Object} MenubarCheckboxItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [checked] - Whether the item is checked.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A checkbox item in a menubar menu.
 * @param {MenubarCheckboxItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

/**
 * @typedef {Object} MenubarRadioItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A radio button item in a menubar menu.
 * @param {MenubarRadioItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

/**
 * @typedef {Object} MenubarLabelProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [inset] - Whether the item is inset.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A label for a group of menubar items.
 * @param {MenubarLabelProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props} />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

/**
 * @typedef {Object} MenubarSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A separator between menubar items.
 * @param {MenubarSeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

/**
 * @typedef {Object} MenubarShortcutProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A keyboard shortcut for a menubar item.
 * @param {MenubarShortcutProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const MenubarShortcut = ({
  className,
  ...props
}) => {
  return (
    (<span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props} />)
  );
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
