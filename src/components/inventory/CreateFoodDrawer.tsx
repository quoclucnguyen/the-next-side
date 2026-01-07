import React, { useEffect } from 'react';
import { Form, Button, Popup, Toast } from 'antd-mobile';
import { useInventoryStore } from '../../stores/inventory/inventoryStore';
import type { FoodFormValues } from '../../types/inventory/types';
import FoodFormFields from './FoodFormFields';
import ImageField from './ImageField';

export interface CreateFoodDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateFoodDrawer: React.FC<CreateFoodDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const addFoodItem = useInventoryStore((state) => state.addFoodItem);
  const [submitting, setSubmitting] = React.useState(false);
  const [image, setImage] = React.useState<string | undefined>();

  // Reset form khi drawer đóng
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setImage(undefined);
    }
  }, [visible, form]);

  const handleSubmit = async (values: FoodFormValues & { image?: string }) => {
    setSubmitting(true);
    try {
      // Tạo food item với Zustand store
      addFoodItem({
        ...values,
        imageUrl: image || null,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      Toast.show({
        content: 'Thêm thực phẩm thành công',
        icon: 'success',
      });

      form.resetFields();
      setImage(undefined);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding food item:', error);
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
          <h2 className="text-xl font-bold mb-2">Thêm thực phẩm</h2>
          <p className="text-gray-500 text-sm">
            Nhập đầy đủ thông tin để lưu vào kho
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
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </Form>
      </div>
    </Popup>
  );
};

export default CreateFoodDrawer;