import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} AvatarProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * An image element with a fallback for when the image fails to load.
 * @param {AvatarProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * @typedef {Object} AvatarImageProps
 * @property {string} [className] - Additional class names for styling.
 * @property {string} src - The source of the image.
 */

/**
 * The image to be displayed in the avatar.
 * @param {AvatarImageProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * @typedef {Object} AvatarFallbackProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * The fallback to be displayed when the image fails to load.
 * @param {AvatarFallbackProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
