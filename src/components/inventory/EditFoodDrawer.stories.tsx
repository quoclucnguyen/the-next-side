import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'antd-mobile';
import EditFoodDrawer from './EditFoodDrawer';

const meta: Meta<typeof EditFoodDrawer> = {
  title: 'Inventory/EditFoodDrawer',
  component: EditFoodDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof EditFoodDrawer>;

const mockItem = {
  id: '1',
  name: 'Táo',
  quantity: 5,
  unit: 'quả',
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Hoa quả',
  imageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const Demo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setVisible(true)} color="primary">
        Mở Drawer Chỉnh Sửa Thực Phẩm
      </Button>
      <EditFoodDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => console.log('Update success')}
        item={mockItem}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};