import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compactButtonLabelClass = 'text-[1.0625rem] min-[700px]:text-[0.9375rem]'
