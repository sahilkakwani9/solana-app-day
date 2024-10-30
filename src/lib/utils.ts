import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const truncateDescription = (description: string, maxLength: number) => {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + "...";
};
