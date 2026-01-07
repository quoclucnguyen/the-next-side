import React, { useState, useRef, useEffect } from 'react';
import { CloseOutline, CameraOutline } from 'antd-mobile-icons';
import classNames from 'classnames';
import {
  processImageFile,
  revokePreviewUrl,
  formatFileSize,
} from '../../utils/inventory/imageUtils';

export interface ImageFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // Maximum file size in bytes (default: 5MB)
  maxWidth?: number; // Maximum image width after resize (default: 800px)
  maxHeight?: number; // Maximum image height after resize (default: 800px)
}

const ImageField: React.FC<ImageFieldProps> = ({
  value,
  onChange,
  error,
  disabled,
  className,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxWidth = 800,
  maxHeight = 800,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (value && value.startsWith('blob:')) {
        revokePreviewUrl(value);
      }
    };
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setPreviewError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPreviewError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setPreviewError(`Kích thước ảnh quá lớn (tối đa ${formatFileSize(maxSize)})`);
      return;
    }

    setIsLoading(true);

    try {
      // Process and resize image
      const base64Image = await processImageFile(file, {
        maxWidth,
        maxHeight,
      });

      // Revoke previous preview if it's an object URL
      if (value && value.startsWith('blob:')) {
        revokePreviewUrl(value);
      }

      onChange?.(base64Image);
    } catch (err) {
      setPreviewError('Không thể xử lý ảnh. Vui lòng thử lại.');
      console.error('Error processing image:', err);
    } finally {
      setIsLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (value && value.startsWith('blob:')) {
      revokePreviewUrl(value);
    }
    onChange?.('');
    setPreviewError(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isLoading}
      />

      <div
        className={classNames(
          'relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition-all duration-200',
          'hover:border-blue-500 hover:bg-blue-50',
          {
            'bg-gray-100': !value,
            'border-gray-200': value && !error,
            'border-red-500': error || previewError,
            'cursor-pointer': !disabled && !isLoading && !value,
            'cursor-not-allowed': disabled || isLoading,
          }
        )}
      >
        {value ? (
          <>
            {/* Image Preview */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-white text-sm font-medium">Đang xử lý...</span>
                </div>
              </div>
            )}

            {/* Remove Button */}
            {!disabled && !isLoading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg"
                disabled={disabled}
              >
                <CloseOutline className="text-xl" />
              </button>
            )}
          </>
        ) : (
          <>
            {/* Empty State */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={classNames(
                  'p-4 rounded-full',
                  'bg-gray-200 hover:bg-blue-100',
                  'transition-colors duration-200'
                )}
              >
                <CameraOutline className="text-3xl text-gray-500" />
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium">Thêm ảnh</p>
                <p className="text-gray-500 text-sm mt-1">
                  Tối đa {formatFileSize(maxSize)}
                </p>
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-700 text-sm font-medium">Đang xử lý...</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Upload Button (for empty state) */}
        {!value && !disabled && !isLoading && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="absolute inset-0 w-full h-full"
            aria-label="Tải ảnh lên"
          />
        )}
      </div>

      {/* Error Message */}
      {(error || previewError) && (
        <p className="mt-2 text-sm text-red-500">{error || previewError}</p>
      )}
    </div>
  );
};

export default ImageField;