import { useState, useCallback } from 'react';
import { Dialog, Toast } from 'antd-mobile';
import { useInventoryStore } from '@/stores/inventory/inventoryStore';
import type { FoodItem } from '@/types/inventory/types';

/**
 * Hook for handling food item deletion with confirm dialog and toast feedback
 * 
 * @returns Object containing delete handler and loading state
 */
export function useDeleteFoodItem() {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteFoodItem = useInventoryStore((state) => state.deleteFoodItem);
  const addFoodItem = useInventoryStore((state) => state.addFoodItem);

  /**
   * Handle delete with confirmation dialog
   * @param item - The food item to delete
   */
  const handleDelete = useCallback(async (item: FoodItem) => {
    // Show confirm dialog
    const result = await Dialog.confirm({
      content: `Bạn có chắc chắn muốn xóa "${item.name}"?`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
    });

    if (result) {
      // User confirmed - proceed with deletion
      setIsDeleting(true);
      
      try {
        // Optimistic update: delete immediately
        deleteFoodItem(item.id);
        
        // Show success toast
        Toast.show({
          content: 'Đã xóa thực phẩm thành công',
          icon: 'success',
        });
      } catch (error) {
        // Error occurred - rollback by adding item back
        addFoodItem(item);
        
        // Show error toast
        Toast.show({
          content: 'Không thể xóa thực phẩm. Vui lòng thử lại.',
          icon: 'fail',
        });
        
        console.error('Error deleting food item:', error);
      } finally {
        setIsDeleting(false);
      }
    }
    // If user cancelled, do nothing
  }, [deleteFoodItem, addFoodItem]);

  return {
    handleDelete,
    isDeleting,
  };
}