import React from 'react';
import { Popup, Button, Space, List } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { getFoodItemStatus, getDaysUntilExpiration, type FoodItem } from '../../types/inventory/types';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/inventory/constants';
import { getTimeAgo } from '../../utils/inventory/dateUtils';
import dayjs from 'dayjs';
import { cn } from '../../utils/cn';

export interface InventoryItemDrawerProps {
  visible: boolean;
  onClose: () => void;
  item: FoodItem | null;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (item: FoodItem) => void;
}

const InventoryItemDrawer: React.FC<InventoryItemDrawerProps> = ({
  visible,
  onClose,
  item,
  onEdit,
  onDelete,
}) => {
  if (!item) return null;

  const status = getFoodItemStatus(item.expirationDate);
  const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
  const statusLabel = STATUS_LABELS[status];
  const statusColorClass = STATUS_COLORS[status];

  const handleEdit = () => {
    onEdit?.(item);
  };

  const handleDelete = () => {
    onDelete?.(item);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      position="right"
      bodyStyle={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        maxHeight: '100vh',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chi tiết thực phẩm</h2>
          <Button
            onClick={onClose}
            color="default"
            fill="none"
            size="small"
          >
            <CloseOutline fontSize={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image */}
          {item.imageUrl && (
            <div className="w-full aspect-square bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="p-4 space-y-6">
            {/* Name and Status */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {item.name}
              </h3>
              <div className="inline-block">
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium border rounded-full',
                    statusColorClass
                  )}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <List className="bg-white">
              <List.Item
                prefix={<span className="text-gray-500">Số lượng</span>}
                extra={
                  <span className="font-medium">
                    {item.quantity} {item.unit}
                  </span>
                }
              />
              <List.Item
                prefix={<span className="text-gray-500">Danh mục</span>}
                extra={<span className="font-medium">{item.category}</span>}
              />
              <List.Item
                prefix={<span className="text-gray-500">Hạn sử dụng</span>}
                extra={
                  <span
                    className={cn(
                      'font-medium',
                      status === 'expired'
                        ? 'text-red-600'
                        : daysUntilExpiration !== null && daysUntilExpiration <= 7
                        ? 'text-yellow-600'
                        : 'text-gray-900'
                    )}
                  >
                    {item.expirationDate
                      ? dayjs(item.expirationDate).format('DD/MM/YYYY')
                      : 'Không có'}
                  </span>
                }
              />
            </List>

            {/* Expiration Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {status === 'expired'
                    ? '⚠️'
                    : daysUntilExpiration !== null && daysUntilExpiration <= 7
                    ? '🔔'
                    : '✅'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    {status === 'expired'
                      ? 'Đã hết hạn'
                      : daysUntilExpiration === null
                      ? 'Không có hạn sử dụng'
                      : daysUntilExpiration === 0
                      ? 'Hết hạn hôm nay'
                      : daysUntilExpiration === 1
                      ? 'Còn 1 ngày'
                      : `Còn ${daysUntilExpiration} ngày`}
                  </p>
                  {status === 'normal' && daysUntilExpiration !== null && daysUntilExpiration > 0 && (
                    <p className="text-sm text-gray-600">
                      Hạn: {dayjs(item.expirationDate).format('DD/MM/YYYY')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <List className="bg-white">
              <List.Item
                prefix={<span className="text-gray-500">Ngày tạo</span>}
                extra={
                  <span className="text-sm text-gray-600">
                    {getTimeAgo(item.createdAt)}
                  </span>
                }
              />
              <List.Item
                prefix={<span className="text-gray-500">Cập nhật</span>}
                extra={
                  <span className="text-sm text-gray-600">
                    {getTimeAgo(item.updatedAt)}
                  </span>
                }
              />
            </List>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-white">
          <Space direction="horizontal" block>
            <Button
              onClick={handleEdit}
              color="primary"
              block
              size="large"
            >
              Chỉnh sửa
            </Button>
            <Button
              onClick={handleDelete}
              color="danger"
              block
              size="large"
            >
              Xóa
            </Button>
          </Space>
        </div>
      </div>
    </Popup>
  );
};

export default InventoryItemDrawer;