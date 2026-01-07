import React from 'react';
import { Card, Button, Badge } from 'antd-mobile';
import { EditSOutline, DeleteOutline } from 'antd-mobile-icons';
import { getFoodItemStatus, getDaysUntilExpiration, type FoodItem } from '../../types/inventory/types';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/inventory/constants';
import { cn } from '../../utils/cn';

export interface InventoryItemCardProps {
  item: FoodItem;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (item: FoodItem) => void;
  onClick?: (item: FoodItem) => void;
  className?: string;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onClick,
  className,
}) => {
  const status = getFoodItemStatus(item.expirationDate);
  const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
  const statusLabel = STATUS_LABELS[status];
  const statusColorClass = STATUS_COLORS[status];

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if clicking action buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    onClick?.(item);
  };

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  // Handle delete click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'cursor-pointer hover:shadow-lg transition-shadow duration-200',
        className
      )}
      bodyClassName="p-4"
    >
      <div className="flex gap-3">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-gray-400 text-2xl">🍎</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {item.name}
            </h3>
            <Badge
              content={statusLabel}
              color="primary"
              className={cn(
                'text-xs font-medium border px-2 py-0.5',
                statusColorClass
              )}
            />
          </div>

          {/* Quantity and Category */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-medium">
              {item.quantity} {item.unit}
            </span>
            <span>•</span>
            <span className="text-gray-500">{item.category}</span>
          </div>

          {/* Expiration Info */}
          <div className="text-sm">
            {status === 'expired' ? (
              <span className="text-red-600 font-medium">Đã hết hạn</span>
            ) : daysUntilExpiration !== null ? (
              <span className={cn(
                daysUntilExpiration <= 7 ? 'text-yellow-600 font-medium' : 'text-gray-600'
              )}>
                {daysUntilExpiration === 0
                  ? 'Hết hạn hôm nay'
                  : `Còn ${daysUntilExpiration} ngày`}
              </span>
            ) : (
              <span className="text-gray-500">Không có hạn sử dụng</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            size="small"
            onClick={handleEditClick}
            className="action-button"
            color="primary"
            fill="none"
          >
            <EditSOutline fontSize={18} />
          </Button>
          <Button
            size="small"
            onClick={handleDeleteClick}
            className="action-button"
            color="danger"
            fill="none"
          >
            <DeleteOutline fontSize={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InventoryItemCard;