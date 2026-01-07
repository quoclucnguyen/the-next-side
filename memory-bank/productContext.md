# Product Context: The Next Side - Pantry Management App

## Why This Project Exists

### Problem Statement
Theo ước tính của các tổ chức môi trường, hàng năm khoảng 1/3 thực phẩm sản xuất trên toàn cầu bị lãng phí. Trong bối cảnh gia đình:
- Người dùng thường quên hạn sử dụng của thực phẩm
- Khó theo dõi những gì có trong tủ bếp
- Mua sắm không theo kế hoạch dẫn đến dư thừa
- Thiếu thông tin về cách sử dụng nguyên liệu có sẵn
- Lãng phí thực phẩm gây thiệt hại tài chính và môi trường

### Solution
The Next Side cung cấp một giải pháp toàn diện để:
- **Theo dõi tập trung**: Quản lý tất cả thực phẩm ở một nơi
- **Cảnh báo thông minh**: Nhắc nhở trước khi hết hạn
- **Gợi ý thực tế**: Công thức dựa trên nguyên liệu có sẵn
- **Tối ưu hóa mua sắm**: Danh sách mua sắm dựa trên nhu cầu thực tế
- **Phân tích dữ liệu**: Thống kê và báo cáo để cải thiện thói quen

## How It Works

### Core User Journey

#### 1. Onboarding (Chưa triển khai)
- Tài khoản người dùng
- Thiết lập tủ bếp ban đầu
- Hướng dẫn sử dụng

#### 2. Daily Use (Đang triển khai - Phase 1)
```
User opens app
  ↓
Views pantry list (Home Screen)
  ↓
Navigates to different sections via bottom nav
  ↓
Searches/filters products
  ↓
Views product details
  ↓
Adds new products (Add Product Screen)
  ↓
Browses recipes (Recipes Screen)
```

#### 3. Product Management (Đang triển khai - Phase 2)
- Thêm sản phẩm mới
- Chỉnh sửa thông tin
- Xóa sản phẩm hết hạn
- Cập nhật số lượng

#### 4. Shopping & Cooking (Chưa triển khai - Phase 3)
- Tạo danh sách mua sắm
- Tìm công thức
- Lưu công thức yêu thích

### Information Architecture

#### Screen Hierarchy
```
App
├── Home Screen (Pantry List)
│   ├── Search bar
│   ├── Filter tabs (All, Fridge, Freezer, Dry Pantry)
│   └── Product list
├── Search Screen (Advanced search)
├── Add Product Screen (Add/Edit product)
├── Recipes Screen (Browse recipes)
└── Profile Screen (User settings)
```

#### Product Data Structure (Đề xuất)
```typescript
interface Product {
  id: string;
  name: string;
  category: 'fridge' | 'freezer' | 'dry-pantry';
  quantity: number;
  unit: 'pc' | 'oz' | 'g' | 'kg' | 'lb';
  expirationDate: Date;
  addedDate: Date;
  brand?: string;
  purchaseHistory: Array<{
    date: Date;
    store: string;
    price: number;
  }>;
  imageUrl?: string;
}
```

### Key User Interactions

#### 1. Viewing Pantry List
- Scroll through product list
- Filter by category
- Search by name
- Tap product to view details

#### 2. Managing Products
- Add new product via form
- Edit existing product details
- Delete expired products
- Update quantity

#### 3. Browsing Recipes
- View recipe suggestions based on pantry items
- Filter by cuisine, difficulty, time
- Save recipes to favorites
- View recipe details and ingredients

#### 4. Navigation
- Bottom navigation bar for main screens
- Back button for nested screens
- Breadcrumb for deep navigation

## User Experience Goals

### Primary Goals
1. **Efficiency**: Thêm và quản lý sản phẩm trong < 30 giây
2. **Clarity**: Hiểu ngay hạn sử dụng và ưu tiên sử dụng
3. **Discoverability**: Tìm sản phẩm hoặc công thức trong < 10 giây
4. **Motivation**: Cảm giác kiểm soát và giảm lãng phí

### Secondary Goals
1. **Learning**: Tìm hiểu cách sử dụng nguyên liệu mới
2. **Planning**: Lên kế hoạch bữa ăn hiệu quả
3. **Community**: Chia sẻ công thức và kinh nghiệm
4. **Sustainability**: Cải thiện tác động môi trường

## Pain Points Addressed

### Current Problems
1. **Memory Overload**: Quên những gì có trong tủ bếp
2. **Time Pressure**: Mua sắm vội vàng dẫn đến mua thừa
3. **Expiration Anxiety**: Không biết khi nào nên dùng
4. **Decision Fatigue**: Không biết nấu gì với nguyên liệu có
5. **Waste Guilt**: Cảm giác tội lỗi khi vứt bỏ thực phẩm

### Our Solutions
1. **Digital Inventory**: Tất cả thông tin ở một nơi
2. **Smart Reminders**: Cảnh báo trước khi hết hạn
3. **Recipe Suggestions**: Công thức phù hợp với nguyên liệu
4. **Shopping Lists**: Danh sách mua sắm thông minh
5. **Waste Tracking**: Phân tích và cải thiện thói quen

## Success Indicators

### User Behavior Metrics
- **Daily Active Users**: Số người dùng hoạt động hàng ngày
- **Session Duration**: Thời gian sử dụng trung bình
- **Feature Usage**: Tỷ lệ sử dụng từng tính năng
- **Retention**: Tỷ lệ người dùng quay lại sau 7/30/90 ngày

### Business Metrics
- **User Acquisition**: Số người dùng mới
- **Churn Rate**: Tỷ lệ người dùng rời đi
- **Revenue** (Phase 4): Doanh thu từ premium features
- **NPS**: Điểm Net Promoter Score

### Impact Metrics
- **Food Waste Reduction**: Tỷ lệ giảm lãng phí thực phẩm
- **Cost Savings**: Tiết kiệm chi phí mua sắm
- **User Satisfaction**: Điểm hài lòng người dùng
- **Environmental Impact**: Lượng CO2 tiết kiệm được

## Competitive Landscape

### Direct Competitors
- **Pantry Check**: Theo dõi thực phẩm, barcode scanning
- **Fridge Tag**: Quản lý tủ lạnh thông minh
- **Out of Milk**: Quản lý danh sách mua sắm

### Indirect Competitors
- **Note-taking apps**: Các app ghi chú như Google Keep
- **Spreadsheets**: Excel, Google Sheets
- **Paper & Pen**: Phương pháp truyền thống

### Differentiation
- **Holistic approach**: Không chỉ theo dõi mà còn gợi ý và tối ưu
- **Mobile-first**: Tối ưu cho trải nghiệm di động
- **Smart features**: AI-powered suggestions
- **User-friendly**: Giao diện đơn giản, dễ sử dụng
- **Affordable**: Miễn phí với optional premium features