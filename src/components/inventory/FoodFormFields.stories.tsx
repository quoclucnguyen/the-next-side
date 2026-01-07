import type { Meta, StoryObj } from '@storybook/react';
import { Form } from 'antd-mobile';
import { useEffect } from 'react';
import FoodFormFields from './FoodFormFields';

const meta: Meta<typeof FoodFormFields> = {
  title: 'Inventory/FoodFormFields',
  component: FoodFormFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FoodFormFields>;

const DemoForm = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: 'Táo',
      quantity: 5,
      unit: 'quả',
      expirationDate: new Date(),
      category: 'Hoa quả',
    });
  }, [form]);

  return (
    <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg">
      <Form form={form} footer={null}>
        <FoodFormFields form={form} disabled={false} />
      </Form>
    </div>
  );
};

export const Default: Story = {
  render: () => <DemoForm />,
};

const DisabledForm = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: 'Táo',
      quantity: 5,
      unit: 'quả',
      expirationDate: new Date(),
      category: 'Hoa quả',
    });
  }, [form]);

  return (
    <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg">
      <Form form={form} footer={null}>
        <FoodFormFields form={form} disabled={true} />
      </Form>
    </div>
  );
};

export const Disabled: Story = {
  render: () => <DisabledForm />,
};
