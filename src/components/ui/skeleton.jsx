import { cn } from "@/lib/utils"

/**
 * @typedef {Object} SkeletonProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A skeleton component that can be used to indicate that content is loading.
 * @param {SkeletonProps} props - The props for the component.
 * @returns {JSX.Element}
 */
function Skeleton({
  className,
  ...props
}) {
  return (<div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />);
}

export { Skeleton }
