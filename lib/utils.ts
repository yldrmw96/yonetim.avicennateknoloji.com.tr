import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Classname'leri birleştirmek için kullanılan utility fonksiyon
 * clsx ve tailwind-merge kullanarak classname'leri birleştirir
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
