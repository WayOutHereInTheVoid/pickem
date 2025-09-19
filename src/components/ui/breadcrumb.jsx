import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} BreadcrumbProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A breadcrumb navigation component.
 * @param {BreadcrumbProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
)
Breadcrumb.displayName = "Breadcrumb"

/**
 * @typedef {Object} BreadcrumbListProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The list of breadcrumb items.
 * @param {BreadcrumbListProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props} />
))
BreadcrumbList.displayName = "BreadcrumbList"

/**
 * @typedef {Object} BreadcrumbItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in the breadcrumb list.
 * @param {BreadcrumbItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

/**
 * @typedef {Object} BreadcrumbLinkProps
 * @property {boolean} [asChild] - Whether to render as a child component.
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A link in the breadcrumb trail.
 * @param {BreadcrumbLinkProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props} />)
  );
})
BreadcrumbLink.displayName = "BreadcrumbLink"

/**
 * @typedef {Object} BreadcrumbPageProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The current page in the breadcrumb trail.
 * @param {BreadcrumbPageProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props} />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

/**
 * @typedef {Object} BreadcrumbSeparatorProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The separator between breadcrumb items.
 * @param {BreadcrumbSeparatorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}>
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

/**
 * @typedef {Object} BreadcrumbEllipsisProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * An ellipsis to indicate that there are more breadcrumb items.
 * @param {BreadcrumbEllipsisProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
