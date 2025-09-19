import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function for conditionally joining class names together.
 * @param {...(string|object|Array<string|object>)} inputs - The class names to join.
 * @returns {string} The joined class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
