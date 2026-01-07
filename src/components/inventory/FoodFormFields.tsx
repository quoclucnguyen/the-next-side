import React, { useState } from 'react';
import { Form, Input, Picker, DatePicker, Stepper } from 'antd-mobile';
import dayjs from 'dayjs';
import { UNITS, CATEGORIES } from '../../types/inventory/constants';
import { getTodayISO } from '../../utils/inventory/dateUtils';

export interface FoodFormFieldsProps {
  form: ReturnType<typeof Form.useForm>[0];
  disabled?: boolean;
}

const FoodFormFields: React.FC<FoodFormFieldsProps> = ({
  disabled = false,
}) => {
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365); // 1 năm sau

  return (
    <div className="space-y-4">
      {/* Name Field */}
      <Form.Item
        name="name"
        label="Tên thực phẩm"
        rules={[
          { required: true, message: 'Vui lòng nhập tên thực phẩm' },
          { min: 1, message: 'Tên không được để trống' },
          { max: 100, message: 'Tên không quá 100 ký tự' },
        ]}
      >
        <Input
          placeholder="Nhập tên thực phẩm"
          clearable
          disabled={disabled}
        />
      </Form.Item>

      {/* Quantity Field */}
      <Form.Item
        name="quantity"
        label="Số lượng"
        initialValue={1}
        rules={[
          { required: true, message: 'Vui lòng nhập số lượng' },
          {
            validator: (_, value) => {
              if (value === undefined || value === null || value === '') {
                return Promise.reject(new Error('Vui lòng nhập số lượng'));
              }
              if (Number(value) <= 0) {
                return Promise.reject(new Error('Số lượng phải lớn hơn 0'));
              }
              return Promise.resolve();
            },
          },
        ]}
        childElementPosition="right"
      >
        <Stepper
          min={1}
          max={999}
          step={1}
          disabled={disabled}
        />
      </Form.Item>

      {/* Unit Field */}
      <Form.Item
        name="unit"
        label="Đơn vị"
        rules={[
          { required: true, message: 'Vui lòng chọn đơn vị' },
        ]}
        trigger="onConfirm"
        onClick={() => {
          setUnitPickerVisible(true);
        }}
      >
        <Picker
          columns={[
            UNITS.map((unit) => ({ label: unit, value: unit })),
          ]}
          visible={unitPickerVisible}
          onClose={() => setUnitPickerVisible(false)}
          onConfirm={() => setUnitPickerVisible(false)}
          onCancel={() => setUnitPickerVisible(false)}
        >
          {(items) => {
            if (!items || items.length === 0 || !items[0]) return 'Chọn đơn vị';
            return items[0].label || 'Chọn đơn vị';
          }}
        </Picker>
      </Form.Item>

      {/* Expiration Date Field */}
      <Form.Item
        name="expirationDate"
        label="Hạn sử dụng"
        rules={[
          { required: true, message: 'Vui lòng chọn hạn sử dụng' },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const todayISO = getTodayISO();
              const todayDate = new Date(todayISO);
              todayDate.setHours(0, 0, 0, 0);
              
              const expDate = new Date(value);
              
              if (expDate < todayDate) {
                return Promise.reject(
                  new Error('Hạn sử dụng phải từ hôm nay trở đi')
                );
              }
              return Promise.resolve();
            },
          },
        ]}
        trigger="onConfirm"
        onClick={() => {
          setDatePickerVisible(true);
        }}
      >
        <DatePicker
          min={today}
          max={maxDate}
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          onConfirm={() => setDatePickerVisible(false)}
          onCancel={() => setDatePickerVisible(false)}
        >
          {(value) =>
            value ? dayjs(value).format('DD/MM/YYYY') : 'Chọn ngày'
          }
        </DatePicker>
      </Form.Item>

      {/* Category Field */}
      <Form.Item
        name="category"
        label="Danh mục"
        rules={[
          { required: true, message: 'Vui lòng chọn danh mục' },
        ]}
        trigger="onConfirm"
        onClick={() => {
          setCategoryPickerVisible(true);
        }}
      >
        <Picker
          columns={[
            CATEGORIES.map((cat) => ({ label: cat, value: cat })),
          ]}
          visible={categoryPickerVisible}
          onClose={() => setCategoryPickerVisible(false)}
          onConfirm={() => setCategoryPickerVisible(false)}
          onCancel={() => setCategoryPickerVisible(false)}
        >
          {(items) => {
            if (!items || items.length === 0 || !items[0]) return 'Chọn danh mục';
            return items[0].label || 'Chọn danh mục';
          }}
        </Picker>
      </Form.Item>
    </div>
  );
};

export default FoodFormFields;