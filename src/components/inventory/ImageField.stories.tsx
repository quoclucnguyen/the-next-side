import type { Meta, StoryObj } from '@storybook/react';
import ImageField from './ImageField';

const meta: Meta<typeof ImageField> = {
  title: 'Inventory/ImageField',
  component: ImageField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ImageField>;

export const Default: Story = {
  args: {
    value: undefined,
    onChange: (value) => console.log('Image changed:', value),
    error: undefined,
    disabled: false,
  },
};

export const WithImage: Story = {
  args: {
    value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    onChange: (value) => console.log('Image changed:', value),
    error: undefined,
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    value: undefined,
    onChange: (value) => console.log('Image changed:', value),
    error: 'Vui lòng chọn hình ảnh',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    onChange: (value) => console.log('Image changed:', value),
    error: undefined,
    disabled: true,
  },
};