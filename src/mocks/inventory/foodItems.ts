import type { FoodItem } from '@/types/inventory/types';

// Helper function to create food items
const createFoodItem = (
  id: string,
  name: string,
  quantity: number,
  unit: string,
  category: string,
  expirationDate: string,
  imageUrl: string | null = null
): FoodItem => ({
  id,
  name,
  quantity,
  unit,
  category,
  expirationDate,
  imageUrl,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
});

// Generate dates relative to today
const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  // Normal items (> 7 days)
  createFoodItem(
    '1',
    'Cà rốt',
    2,
    'kg',
    'Rau củ',
    addDays(14)
  ),
  createFoodItem(
    '2',
    'Bắp cải',
    1,
    'cái',
    'Rau củ',
    addDays(10)
  ),
  createFoodItem(
    '3',
    'Cam sành',
    5,
    'kg',
    'Trái cây',
    addDays(21)
  ),
  createFoodItem(
    '4',
    'Thịt gà',
    1.5,
    'kg',
    'Thịt',
    addDays(8)
  ),
  createFoodItem(
    '5',
    'Cá tra',
    1,
    'kg',
    'Cá',
    addDays(12)
  ),
  createFoodItem(
    '6',
    'Sữa tươi',
    2,
    'lít',
    'Sữa',
    addDays(15)
  ),
  createFoodItem(
    '7',
    'Nước suối',
    6,
    'chai',
    'Đồ uống',
    addDays(60)
  ),
  createFoodItem(
    '8',
    'Mì tôm',
    10,
    'gói',
    'Đồ khô',
    addDays(180)
  ),
  
  // Expiring soon items (1-7 days)
  createFoodItem(
    '9',
    'Cà chua',
    1,
    'kg',
    'Rau củ',
    addDays(5)
  ),
  createFoodItem(
    '10',
    'Chuối',
    1,
    'kg',
    'Trái cây',
    addDays(3)
  ),
  createFoodItem(
    '11',
    'Thịt bò',
    500,
    'gram',
    'Thịt',
    addDays(4)
  ),
  createFoodItem(
    '12',
    'Cá basa',
    800,
    'gram',
    'Cá',
    addDays(2)
  ),
  createFoodItem(
    '13',
    'Sữa chua',
    4,
    'hộp',
    'Sữa',
    addDays(6)
  ),
  createFoodItem(
    '14',
    'Nước trái cây',
    2,
    'lít',
    'Đồ uống',
    addDays(5)
  ),
  
  // Expired items (< 0 days)
  createFoodItem(
    '15',
    'Xà lách',
    300,
    'gram',
    'Rau củ',
    addDays(-2)
  ),
  createFoodItem(
    '16',
    'Dưa hấu',
    1,
    'cái',
    'Trái cây',
    addDays(-1)
  ),
  createFoodItem(
    '17',
    'Thịt heo',
    400,
    'gram',
    'Thịt',
    addDays(-3)
  ),
  createFoodItem(
    '18',
    'Cá thu',
    300,
    'gram',
    'Cá',
    addDays(-5)
  ),
  createFoodItem(
    '19',
    'Phô mai',
    200,
    'gram',
    'Sữa',
    addDays(-1)
  ),
  
  // More diverse items with images
  createFoodItem(
    '20',
    'Khoai tây',
    2,
    'kg',
    'Rau củ',
    addDays(20)
  ),
  createFoodItem(
    '21',
    'Táo',
    2,
    'kg',
    'Trái cây',
    addDays(15)
  ),
  createFoodItem(
    '22',
    'Ức gà',
    1,
    'kg',
    'Thịt',
    addDays(6)
  ),
  createFoodItem(
    '23',
    'Tôm',
    800,
    'gram',
    'Cá',
    addDays(1)
  ),
  createFoodItem(
    '24',
    'Sữa đặc',
    2,
    'lon',
    'Sữa',
    addDays(90)
  ),
  createFoodItem(
    '25',
    'Cà phê hòa tan',
    5,
    'gói',
    'Đồ khô',
    addDays(365)
  ),
  createFoodItem(
    '26',
    'Bia',
    12,
    'lon',
    'Đồ uống',
    addDays(120)
  ),
  createFoodItem(
    '27',
    'Hành tây',
    500,
    'gram',
    'Rau củ',
    addDays(7)
  ),
  createFoodItem(
    '28',
    'Nho',
    1,
    'kg',
    'Trái cây',
    addDays(4)
  ),
  createFoodItem(
    '29',
    'Giò lụa',
    300,
    'gram',
    'Thịt',
    addDays(3)
  ),
  createFoodItem(
    '30',
    'Mắm',
    2,
    'chai',
    'Khác',
    addDays(180)
  ),
];

// Helper to get mock items with pagination
export const getMockFoodItems = (page: number = 1, pageSize: number = 8) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: MOCK_FOOD_ITEMS.slice(start, end),
    hasMore: end < MOCK_FOOD_ITEMS.length,
    total: MOCK_FOOD_ITEMS.length,
  };
};

// Helper to get mock items by category
export const getMockFoodItemsByCategory = (category: string | null) => {
  if (!category) return MOCK_FOOD_ITEMS;
  return MOCK_FOOD_ITEMS.filter(item => item.category === category);
};

// Helper to search mock items
export const searchMockFoodItems = (query: string | null) => {
  if (!query) return MOCK_FOOD_ITEMS;
  const lowerQuery = query.toLowerCase();
  return MOCK_FOOD_ITEMS.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
};

// Helper to get expiring soon items
export const getExpiringSoonMockItems = (days: number = 7) => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  
  return MOCK_FOOD_ITEMS.filter(item => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    threshold.setHours(0, 0, 0, 0);
    return expDate >= today && expDate <= threshold;
  });
};

// Helper to get expired items
export const getExpiredMockItems = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return MOCK_FOOD_ITEMS.filter(item => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    expDate.setHours(0, 0, 0, 0);
    return expDate < today;
  });
};
