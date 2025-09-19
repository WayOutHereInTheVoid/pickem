import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

/**
 * @typedef {Object} PaginationProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A pagination component that displays a list of pages and allows the user to navigate between them.
 * @param {PaginationProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

/**
 * @typedef {Object} PaginationContentProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The content of the pagination component.
 * @param {PaginationContentProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

/**
 * @typedef {Object} PaginationItemProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A single item in the pagination component.
 * @param {PaginationItemProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

/**
 * @typedef {Object} PaginationLinkProps
 * @property {string} [className] - Additional class names for styling.
 * @property {boolean} [isActive] - Whether the link is active.
 * @property {'icon' | 'default'} [size='icon'] - The size of the link.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A link in the pagination component.
 * @param {PaginationLinkProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }), className)}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

/**
 * @typedef {Object} PaginationPreviousProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * The previous page link in the pagination component.
 * @param {PaginationPreviousProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationPrevious = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

/**
 * @typedef {Object} PaginationNextProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * The next page link in the pagination component.
 * @param {PaginationNextProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationNext = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

/**
 * @typedef {Object} PaginationEllipsisProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * An ellipsis in the pagination component.
 * @param {PaginationEllipsisProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
