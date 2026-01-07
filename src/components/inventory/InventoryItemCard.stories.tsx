import type { Meta, StoryObj } from '@storybook/react';
import InventoryItemCard from './InventoryItemCard';

const meta: Meta<typeof InventoryItemCard> = {
  title: 'Inventory/InventoryItemCard',
  component: InventoryItemCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InventoryItemCard>;

const normalItem = {
  id: '1',
  name: 'Táo',
  quantity: 5,
  unit: 'quả',
  expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Hoa quả',
  imageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const expiringSoonItem = {
  id: '2',
  name: 'Chuối',
  quantity: 3,
  unit: 'cây',
  expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Hoa quả',
  imageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const expiredItem = {
  id: '3',
  name: 'Sữa tươi',
  quantity: 2,
  unit: 'hộp',
  expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Sữa & Đồ uống',
  imageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Normal: Story = {
  args: {
    item: normalItem,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onClick: () => console.log('Card clicked'),
  },
};

export const ExpiringSoon: Story = {
  args: {
    item: expiringSoonItem,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onClick: () => console.log('Card clicked'),
  },
};

export const Expired: Story = {
  args: {
    item: expiredItem,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onClick: () => console.log('Card clicked'),
  },
};

export const NoActions: Story = {
  args: {
    item: normalItem,
    onClick: () => console.log('Card clicked'),
  },
};