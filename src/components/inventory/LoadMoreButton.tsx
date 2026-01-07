import React from 'react';
import { Button } from 'antd-mobile';

export interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasMore,
  isLoading,
  onLoadMore,
  className,
}) => {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        loadingText="Đang tải..."
        loading={isLoading}
      >
        Xem thêm
      </Button>
    </div>
  );
};

export default LoadMoreButton;