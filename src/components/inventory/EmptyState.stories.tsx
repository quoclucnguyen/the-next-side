import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Inventory/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'Không có thực phẩm',
    description: 'Bạn chưa thêm thực phẩm nào vào kho. Hãy thêm ngay!',
    actionText: 'Thêm thực phẩm',
    onAction: () => console.log('Add clicked'),
  },
};

export const NoAction: Story = {
  args: {
    title: 'Không tìm thấy kết quả',
    description: 'Không có thực phẩm nào phù hợp với tìm kiếm của bạn.',
  },
};

export const Minimal: Story = {
  args: {
    title: 'Kho trống',
    onAction: () => console.log('Action clicked'),
  },
};