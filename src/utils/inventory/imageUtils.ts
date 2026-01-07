/**
 * Image utility functions for Food Inventory
 */

/**
 * Image processing configuration
 */
export const IMAGE_CONFIG = {
  MAX_WIDTH: 800,
  MAX_HEIGHT: 800,
  MAX_SIZE_MB: 5,
  QUALITY: 0.85,
} as const;

/**
 * Resize an image file to fit within max dimensions
 * @param file - Original image file
 * @param maxWidth - Maximum width (default: 800)
 * @param maxHeight - Maximum height (default: 800)
 * @param quality - JPEG quality (0-1, default: 0.85)
 * @returns Resized image as base64 string
 */
export async function resizeImage(
  file: File,
  maxWidth: number = IMAGE_CONFIG.MAX_WIDTH,
  maxHeight: number = IMAGE_CONFIG.MAX_HEIGHT,
  quality: number = IMAGE_CONFIG.QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận định dạng ảnh: JPG, PNG, WebP',
    };
  }
  
  // Check file size
  const maxSizeBytes = IMAGE_CONFIG.MAX_SIZE_MB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Kích thước ảnh tối đa: ${IMAGE_CONFIG.MAX_SIZE_MB}MB`,
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'Ảnh không thể trống',
    };
  }
  
  return { isValid: true };
}

/**
 * Convert file to base64 without resizing
 * @param file - File to convert
 * @returns Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Get file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Create object URL for image preview
 * @param file - Image file
 * @returns Object URL (remember to revoke when done)
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory
 * @param url - Object URL to revoke
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Process image file: validate, resize, and convert to base64
 * @param file - Image file to process
 * @param options - Processing options
 * @returns Processed base64 string
 * @throws Error if validation fails or processing encounters error
 */
export async function processImageFile(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<string> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  // Resize and convert to base64
  const base64 = await resizeImage(
    file,
    options?.maxWidth ?? IMAGE_CONFIG.MAX_WIDTH,
    options?.maxHeight ?? IMAGE_CONFIG.MAX_HEIGHT,
    options?.quality ?? IMAGE_CONFIG.QUALITY
  );
  
  return base64;
}

/**
 * Check if a string is a valid base64 image
 * @param str - String to check
 * @returns true if valid base64 image
 */
export function isValidBase64Image(str: string | null): boolean {
  if (!str) return false;
  
  // Check base64 data URI pattern
  const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/;
  return base64Pattern.test(str);
}

/**
 * Extract file extension from MIME type
 * @param mimeType - MIME type (e.g., "image/jpeg")
 * @returns File extension (e.g., ".jpg")
 */
export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  
  return extensions[mimeType] || '.jpg';
}

/**
 * Download image from base64 string
 * @param base64 - Base64 image string
 * @param filename - File name to save as
 */
export function downloadBase64Image(base64: string, filename: string): void {
  const link = document.createElement('a');
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}