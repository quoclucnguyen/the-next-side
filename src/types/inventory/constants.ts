// Food Inventory Constants

/**
 * Food categories
 */
export const CATEGORIES = [
  'Rau củ',
  'Trái cây',
  'Thịt',
  'Cá',
  'Sữa',
  'Đồ uống',
  'Đồ khô',
  'Khác',
] as const;

export type Category = typeof CATEGORIES[number];

/**
 * Food units
 */
export const UNITS = [
  'kg',
  'gram',
  'g',
  'lít',
  'ml',
  'cái',
  'hộp',
  'gói',
  'túi',
] as const;

export type Unit = typeof UNITS[number];

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES = {
  name: '',
  quantity: 1,
  unit: 'cái' as Unit,
  expirationDate: new Date().toISOString().split('T')[0],
  category: 'Khác' as Category,
} as const;

/**
 * Pagination settings
 */
export const PAGE_SIZE = 8;

/**
 * Image settings
 */
export const IMAGE_MAX_WIDTH = 800;
export const IMAGE_MAX_HEIGHT = 800;
export const IMAGE_QUALITY = 0.85;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  INVENTORY_STATE: 'inventory-storage',
} as const;

/**
 * Validation messages
 */
export const VALIDATION_MESSAGES = {
  name: {
    required: 'Vui lòng nhập tên thực phẩm',
    minLength: 'Tên phải có ít nhất 1 ký tự',
  },
  quantity: {
    required: 'Vui lòng nhập số lượng',
    min: 'Số lượng phải lớn hơn 0',
  },
  unit: {
    required: 'Vui lòng chọn đơn vị tính',
  },
  expirationDate: {
    required: 'Vui lòng chọn ngày hết hạn',
    invalidFormat: 'Định dạng ngày không hợp lệ',
    pastDate: 'Ngày hết hạn không thể là quá khứ',
  },
  category: {
    required: 'Vui lòng chọn danh mục',
  },
} as const;

/**
 * Empty state messages
 */
export const EMPTY_STATE_MESSAGES = {
  title: 'Chưa có thực phẩm trong kho',
  description: 'Bắt đầu thêm thực phẩm để quản lý kho của bạn',
  cta: 'Thêm thực phẩm đầu tiên',
} as const;

/**
 * Loading messages
 */
export const LOADING_MESSAGES = {
  creating: 'Đang tạo...',
  updating: 'Đang cập nhật...',
  deleting: 'Đang xóa...',
  loading: 'Đang tải...',
  analyzing: 'Đang phân tích...',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  created: 'Đã thêm thực phẩm thành công!',
  updated: 'Đã cập nhật thực phẩm thành công!',
  deleted: 'Đã xóa thực phẩm thành công!',
  imageUploaded: 'Đã tải lên hình ảnh!',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  generic: 'Có lỗi xảy ra. Vui lòng thử lại.',
  network: 'Không thể kết nối. Vui lòng kiểm tra mạng.',
  upload: 'Không thể tải lên hình ảnh.',
  notFound: 'Không tìm thấy thực phẩm.',
} as const;

/**
 * Status labels
 */
export const STATUS_LABELS = {
  normal: 'Bình thường',
  'expiring-soon': 'Sắp hết hạn',
  expired: 'Đã hết hạn',
} as const;

/**
 * Status colors (Tailwind classes)
 */
export const STATUS_COLORS = {
  normal: 'bg-green-100 text-green-800 border-green-200',
  'expiring-soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
} as const;