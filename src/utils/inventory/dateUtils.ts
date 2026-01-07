/**
 * Date utility functions for Food Inventory
 */

/**
 * Format date to Vietnamese locale string
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "15/01/2026")
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Chưa đặt';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format date with weekday in Vietnamese
 * @param dateString - ISO date string
 * @returns Formatted date string with weekday (e.g., "Thứ Năm, 15/01/2026")
 */
export function formatDateWithWeekday(dateString: string | null): string {
  if (!dateString) return 'Chưa đặt';
  
  const date = new Date(dateString);
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const weekday = weekdays[date.getDay()];
  const dateStr = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  return `${weekday}, ${dateStr}`;
}

/**
 * Calculate days remaining until expiration
 * @param expirationDate - ISO date string
 * @returns Number of days remaining (positive for future, negative for expired, null if no date)
 */
export function getDaysRemaining(expirationDate: string | null): number | null {
  if (!expirationDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get human-readable expiration text
 * @param expirationDate - ISO date string
 * @returns Human-readable text (e.g., "Còn 5 ngày", "Đã hết hạn 2 ngày", "Hết hạn hôm nay")
 */
export function getExpirationText(expirationDate: string | null): string {
  const daysRemaining = getDaysRemaining(expirationDate);
  
  if (daysRemaining === null) return 'Chưa đặt';
  if (daysRemaining === 0) return 'Hết hạn hôm nay';
  if (daysRemaining === 1) return 'Hết hạn vào ngày mai';
  if (daysRemaining > 0) return `Còn ${daysRemaining} ngày`;
  if (daysRemaining === -1) return 'Đã hết hạn 1 ngày';
  return `Đã hết hạn ${Math.abs(daysRemaining)} ngày`;
}

/**
 * Check if a date is expiring soon (within threshold days)
 * @param expirationDate - ISO date string
 * @param threshold - Number of days threshold (default: 7)
 * @returns true if expiring soon or already expired
 */
export function isExpiringSoon(expirationDate: string | null, threshold: number = 7): boolean {
  const daysRemaining = getDaysRemaining(expirationDate);
  if (daysRemaining === null) return false;
  return daysRemaining <= threshold;
}

/**
 * Check if a date has already expired
 * @param expirationDate - ISO date string
 * @returns true if expired
 */
export function isExpired(expirationDate: string | null): boolean {
  const daysRemaining = getDaysRemaining(expirationDate);
  if (daysRemaining === null) return false;
  return daysRemaining < 0;
}

/**
 * Get time ago text (e.g., "2 ngày trước", "5 giờ trước")
 * @param dateString - ISO date string
 * @returns Human-readable time ago text
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
}

/**
 * Format date time string for input (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Formatted date string for input
 */
export function formatDateForInput(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in ISO format at midnight
 * @returns Today's date as ISO string
 */
export function getTodayISO(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

/**
 * Get date after N days from today
 * @param days - Number of days to add (can be negative for past dates)
 * @returns ISO string of the date
 */
export function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}