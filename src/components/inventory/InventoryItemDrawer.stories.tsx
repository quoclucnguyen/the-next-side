import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'antd-mobile';
import InventoryItemDrawer from './InventoryItemDrawer';

const meta: Meta<typeof InventoryItemDrawer> = {
  title: 'Inventory/InventoryItemDrawer',
  component: InventoryItemDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof InventoryItemDrawer>;

const mockItem = {
  id: '1',
  name: 'Táo Gala',
  quantity: 5,
  unit: 'quả',
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Hoa quả',
  imageUrl: null,
  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

const Demo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setVisible(true)} color="primary">
        Mở Drawer Chi Tiết Thực Phẩm
      </Button>
      <InventoryItemDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        item={mockItem}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};

const NoActionsDemo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setVisible(true)} color="primary">
        Mở Drawer Chi Tiết (Không Actions)
      </Button>
      <InventoryItemDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        item={mockItem}
      />
    </div>
  );
};

export const NoActions: Story = {
  render: () => <NoActionsDemo />,
};
