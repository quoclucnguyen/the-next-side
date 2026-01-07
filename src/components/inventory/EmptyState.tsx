import React from 'react';
import { Empty } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import classNames from 'classnames';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có dữ liệu',
  description = 'Bắt đầu thêm thực phẩm vào kho của bạn',
  actionText = 'Thêm thực phẩm',
  onAction,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center py-12 px-4 animate-fade-in',
        className
      )}
    >
      <Empty
        image={
          <div className="w-24 h-24 mb-4">
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full text-gray-300"
              fill="currentColor"
            >
              <rect x="8" y="16" width="48" height="40" rx="4" fill="currentColor" opacity="0.2" />
              <rect x="12" y="20" width="12" height="8" rx="1" fill="currentColor" />
              <rect x="12" y="32" width="40" height="4" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="12" y="40" width="32" height="4" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="12" y="48" width="28" height="4" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
        }
        description={
          <div className="text-center">
            <p className="text-gray-900 font-medium text-lg mb-1">{title}</p>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        }
      />
      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-sm"
        >
          <AddOutline className="text-xl" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;