import { isEqual } from "@ngard/tiny-isequal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isDeepEqual = isEqual;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
