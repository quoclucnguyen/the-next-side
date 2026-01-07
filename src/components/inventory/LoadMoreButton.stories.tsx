import type { Meta, StoryObj } from '@storybook/react';
import LoadMoreButton from './LoadMoreButton';

const meta: Meta<typeof LoadMoreButton> = {
  title: 'Inventory/LoadMoreButton',
  component: LoadMoreButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof LoadMoreButton>;

export const Default: Story = {
  args: {
    hasMore: true,
    isLoading: false,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const Loading: Story = {
  args: {
    hasMore: true,
    isLoading: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const NoMoreData: Story = {
  args: {
    hasMore: false,
    isLoading: false,
    onLoadMore: () => console.log('Load more clicked'),
  },
};

export const LoadingAndNoMore: Story = {
  args: {
    hasMore: false,
    isLoading: true,
    onLoadMore: () => console.log('Load more clicked'),
  },
};