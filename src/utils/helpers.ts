import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(price);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateSuggestedPrice(originalPrice: number, condition: string): { min: number; max: number } | null {
  if (!originalPrice || isNaN(originalPrice)) return null;
  
  const cond = condition.toLowerCase();
  
  if (cond.includes('new with tags')) {
    return { min: Math.round(originalPrice * 0.65), max: Math.round(originalPrice * 0.75) };
  } else if (cond.includes('like new')) {
    return { min: Math.round(originalPrice * 0.55), max: Math.round(originalPrice * 0.65) };
  } else if (cond.includes('good')) {
    return { min: Math.round(originalPrice * 0.4), max: Math.round(originalPrice * 0.5) };
  } else if (cond.includes('worn')) {
    return { min: Math.round(originalPrice * 0.2), max: Math.round(originalPrice * 0.3) };
  }
  
  return null;
}
