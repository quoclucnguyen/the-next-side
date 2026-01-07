// Food Inventory Types

/**
 * Food Item entity from database
 */
export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string | null;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Food Item row from database (nullable fields)
 */
export interface FoodItemRow {
  id?: string;
  name?: string;
  quantity?: number | string | null;
  unit?: string | null;
  expiration_date?: string | null;
  category?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Form values for creating/editing food item
 */
export interface FoodFormValues {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  category: string;
  imageFile?: File;
}

/**
 * Food item status for UI display
 */
export type FoodItemStatus = 'normal' | 'expiring-soon' | 'expired';

/**
 * Expiration threshold (in days)
 */
export const EXPIRATION_THRESHOLD_DAYS = 7;

/**
 * Get food item status based on expiration date
 */
export function getFoodItemStatus(expirationDate: string | null): FoodItemStatus {
  if (!expirationDate) return 'normal';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= EXPIRATION_THRESHOLD_DAYS) return 'expiring-soon';
  return 'normal';
}

/**
 * Calculate days until expiration
 */
export function getDaysUntilExpiration(expirationDate: string | null): number | null {
  if (!expirationDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}