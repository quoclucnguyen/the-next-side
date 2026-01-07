import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from 'antd-mobile';
import CreateFoodDrawer from './CreateFoodDrawer';

const meta: Meta<typeof CreateFoodDrawer> = {
  title: 'Inventory/CreateFoodDrawer',
  component: CreateFoodDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CreateFoodDrawer>;

const Demo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setVisible(true)} color="primary">
        Mở Drawer Thêm Thực Phẩm
      </Button>
      <CreateFoodDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => console.log('Create success')}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};