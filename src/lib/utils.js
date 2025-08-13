import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * 
 * Responsibility:
 * - Combines multiple class names intelligently
 * - Resolves conflicting Tailwind classes
 * - Provides consistent class merging across components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
