import React, { useEffect } from 'react';
import { Form, Button, Popup, Toast } from 'antd-mobile';
import { useInventoryStore } from '../../stores/inventory/inventoryStore';
import type { FoodItem, FoodFormValues } from '../../types/inventory/types';
import FoodFormFields from './FoodFormFields';
import ImageField from './ImageField';

export interface EditFoodDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: FoodItem;
}

const EditFoodDrawer: React.FC<EditFoodDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
  item,
}) => {
  const [form] = Form.useForm();
  const updateFoodItem = useInventoryStore((state) => state.updateFoodItem);
  const [submitting, setSubmitting] = React.useState(false);
  const [image, setImage] = React.useState<string | undefined>();

  // Pre-fill form khi drawer mở
  useEffect(() => {
    if (visible && item) {
      form.setFieldsValue({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: item.expirationDate,
        category: item.category,
      });
      setImage(item.imageUrl || undefined);
    }
  }, [visible, item, form]);

  // Reset form khi drawer đóng
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setImage(undefined);
    }
  }, [visible, form]);

  const handleSubmit = async (values: FoodFormValues) => {
    setSubmitting(true);
    try {
      // Update food item với Zustand store
      updateFoodItem(item.id, {
        ...values,
        imageUrl: image || null,
        updatedAt: new Date().toISOString(),
      });

      Toast.show({
        content: 'Cập nhật thực phẩm thành công',
        icon: 'success',
      });

      form.resetFields();
      setImage(undefined);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating food item:', error);
      Toast.show({
        content: 'Có lỗi xảy ra, vui lòng thử lại',
        icon: 'fail',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImage(undefined);
    onClose();
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={handleCancel}
      position="bottom"
      bodyStyle={{ minHeight: '80vh', maxHeight: '90vh' }}
      bodyClassName="overflow-y-auto"
    >
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Chỉnh sửa thực phẩm</h2>
          <p className="text-gray-500 text-sm">
            Cập nhật thông tin thực phẩm
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Image Field */}
          <div className="mb-4">
            <ImageField
              value={image}
              onChange={setImage}
              disabled={submitting}
            />
          </div>

          {/* Form Fields */}
          <FoodFormFields form={form} disabled={submitting} />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              block
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              block
              type="submit"
              color="primary"
              loading={submitting}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </Form>
      </div>
    </Popup>
  );
};

export default EditFoodDrawer;