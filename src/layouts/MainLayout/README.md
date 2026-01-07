# MainLayout Component

MainLayout là một layout component trung tâm cho ứng dụng Pantry App, cung cấp cấu trúc nhất quán cho tất cả các màn hình với Header, Content Area, và BottomNavigation.

## Features

- **Flexible Components**: Tùy chỉnh hiển thị/ẩn Header và BottomNavigation
- **Responsive Design**: Mobile-first approach với centered container trên desktop
- **Smooth Scrolling**: Tự động scroll lên đầu khi chuyển route
- **Customizable Styling**: Tùy chỉnh màu sắc, padding, và kích thước
- **Safe Area Support**: Hỗ trợ safe area tự động cho iOS devices (notch, home indicator)
- **Scroll Detection**: Header tự động ẩn khi scroll xuống (built-in trong Header component)

## Props

### MainLayoutProps

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | *Required* | Nội dung của layout |
| `showHeader` | `boolean` | `true` | Hiển thị/ẩn Header |
| `showBottomNavigation` | `boolean` | `true` | Hiển thị/ẩn BottomNavigation |
| `headerProps` | `Omit<HeaderProps, 'className'>` | `{}` | Props truyền vào Header component |
| `bottomNavigationProps` | `Omit<BottomNavigationProps, 'className'>` | `{}` | Props truyền vào BottomNavigation |
| `contentPadding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Kích thước padding cho content area |
| `contentBackgroundColor` | `string` | `undefined` | Màu nền cho content area |
| `backgroundColor` | `string` | `'#F5F5F5'` | Màu nền cho layout container |
| `maxWidth` | `number \| string` | `undefined` | Chiều rộng tối đa của container |
| `className` | `string` | `undefined` | Custom class names |
| `bottomNavigationBorderTop` | `string` | `undefined` | Border top styling cho BottomNavigation |
| `bottomNavigationBorderRadius` | `string` | `undefined` | Border radius cho BottomNavigation corners |
| `bottomNavigationBoxShadow` | `string` | `undefined` | Box shadow cho BottomNavigation |
| `bottomNavigationPosition` | `'fixed' \| 'sticky' \| 'relative'` | `undefined` | Position type cho BottomNavigation |
| `smoothScroll` | `boolean` | `true` | Bật/tắt smooth scroll khi chuyển route |

## Usage Examples

### Basic Usage

```tsx
import { MainLayout } from '@/layouts/MainLayout';

function MyScreen() {
  return (
    <MainLayout>
      <div>Your content here</div>
    </MainLayout>
  );
}
```

### Without Header

```tsx
<MainLayout showHeader={false}>
  <div>Content without header</div>
</MainLayout>
```

### Custom Header

```tsx
<MainLayout 
  headerProps={{
    title: 'My Custom Title',
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF',
    showBackButton: true,
    rightComponent: <HeaderSearchButton />
  }}
>
  <div>Content with custom header</div>
</MainLayout>
```

### Custom Styling

```tsx
<MainLayout 
  backgroundColor="#E8F5E9"
  contentBackgroundColor="#FFFFFF"
  contentPadding="xl"
  maxWidth="1024px"
>
  <div>Content with custom styling</div>
</MainLayout>
```

### Custom Bottom Navigation Styling

```tsx
<MainLayout 
  maxWidth="1024px"
  bottomNavigationBorderTop="2px solid #FF6B35"
  bottomNavigationBorderRadius="16px 16px 0 0"
  bottomNavigationBoxShadow="0 -4px 12px rgba(255, 107, 53, 0.2)"
>
  <div>Content with styled bottom navigation</div>
</MainLayout>
```

### Sticky Bottom Navigation

```tsx
<MainLayout 
  bottomNavigationPosition="sticky"
  bottomNavigationBoxShadow="0 -2px 8px rgba(0, 0, 0, 0.08)"
>
  <div>Content with sticky bottom navigation</div>
</MainLayout>
```

### Dark Theme with Bottom Navigation

```tsx
<MainLayout 
  maxWidth="1024px"
  backgroundColor="#1A1A1A"
  contentBackgroundColor="#2D2D2D"
  headerProps={{
    backgroundColor: '#2D2D2D',
    textColor: '#FFFFFF',
    borderColor: '#404040',
  }}
  bottomNavigationBorderTop="1px solid #404040"
  bottomNavigationBoxShadow="0 -2px 8px rgba(0, 0, 0, 0.4)"
>
  <div>Content with dark theme</div>
</MainLayout>
```

### Minimal Layout

```tsx
<MainLayout 
  showHeader={false}
  showBottomNavigation={false}
  contentPadding="none"
  backgroundColor="#FFFFFF"
>
  <div>Pure content area</div>
</MainLayout>
```

## Layout Structure

```
MainLayout Container
├── SafeArea (position="top") - iOS notch support
├── Header (optional)
├── Content Area (scrollable)
│   └── Content Wrapper (with padding)
│       └── children
├── BottomNavigation (optional)
└── SafeArea (position="bottom") - iOS home indicator support
```

## Safe Area Integration

MainLayout tự động tích hợp `SafeArea` component từ `antd-mobile` để xử lý safe areas cho iOS devices:

### What are Safe Areas?

Safe Areas là các khu vực trên màn hình iOS devices cần tránh:
- **Top Safe Area**: Notch và status bar trên iPhone X+
- **Bottom Safe Area**: Home indicator trên iPhone X+
- **Side Safe Areas**: Notch corners ở landscape mode

### Automatic Handling

MainLayout tự động thêm SafeArea khi:
- Header hiển thị → Thêm `<SafeArea position="top" />` trước Header
- BottomNavigation hiển thị → Thêm `<SafeArea position="bottom" />` sau BottomNavigation

### Benefits

✅ **No Manual Configuration**: Tự động thêm padding khi cần thiết
✅ **Cross-Device Compatible**: Hoạt động trên iOS, Android, và desktop
✅ **No Impact on Non-iOS Devices**: Chỉ áp dụng padding trên iOS
✅ **Optimal User Experience**: Nội dung không bị notch/home indicator che khuất

### Example

```tsx
<MainLayout>
  {/* Tự động có SafeArea cho Header và BottomNavigation */}
  <div>Your content here</div>
</MainLayout>
```

### Disable Safe Areas

Nếu muốn disable Safe Areas (không khuyến nghị cho iOS):

```tsx
<MainLayout 
  showHeader={false} 
  showBottomNavigation={false}
>
  <div>Content without safe areas</div>
</MainLayout>
```

**Lưu ý**: SafeAreas chỉ được áp dụng khi Header/BottomNavigation hiển thị. Nếu ẩn cả hai, SafeAreas cũng sẽ ẩn.

## Responsive Behavior

### Mobile (default)
- Full width container
- Header height: 56px
- BottomNavigation height: 56px
- Content area fills remaining space

### Desktop (≥768px)
- Centered container với max-width (tùy chỉnh qua `maxWidth` prop hoặc mặc định 768px)
- Box shadow cho visual separation
- Border cho visual definition
- BottomNavigation tự động centered với cùng maxWidth
- Customizable border, radius, shadow cho BottomNavigation

## Integration with React Router

MainLayout được thiết kế để hoạt động với React Router v7:

```tsx
import { Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutWrapper />}>
        <Route index element={<HomeScreen />} />
        <Route path="search" element={<SearchScreen />} />
        {/* ... more routes */}
      </Route>
    </Routes>
  );
}
```

## Customization Tips

### 1. Different Header per Route
```tsx
// Trong mỗi screen, bạn có thể dùng MainLayout riêng với headerProps khác
<MainLayout 
  headerProps={{ 
    title: 'Products',
    rightComponent: <HeaderEditButton onEdit={handleEdit} />
  }}
>
  <ProductList />
</MainLayout>
```

### 2. Dynamic Header Title
MainLayout tự động xác định title dựa trên route pathname:
- `/` → "Pantry App"
- `/search` → "Search"
- `/recipes` → "Recipes"
- `/profile` → "Profile"
- `/add-product` → "Add Product"
- `/product/:id` → "Product Details"

Bạn có thể override bằng cách truyền `headerProps.title`.

### 3. Theme Customization
```tsx
// Light theme
<MainLayout 
  backgroundColor="#F5F5F5"
  headerProps={{ backgroundColor: '#FFFFFF', textColor: '#333333' }}
/>

// Dark theme
<MainLayout 
  backgroundColor="#1A1A1A"
  contentBackgroundColor="#2D2D2D"
  headerProps={{ backgroundColor: '#2D2D2D', textColor: '#FFFFFF' }}
  bottomNavigationBorderTop="1px solid #404040"
  bottomNavigationBoxShadow="0 -2px 8px rgba(0, 0, 0, 0.4)"
/>
```

### 4. Bottom Navigation Customization
```tsx
// Modern rounded look
<MainLayout 
  maxWidth="1024px"
  bottomNavigationBorderRadius="16px 16px 0 0"
  bottomNavigationBoxShadow="0 -4px 16px rgba(0, 0, 0, 0.1)"
/>

// Minimal look
<MainLayout 
  bottomNavigationBorderTop="none"
  bottomNavigationBoxShadow="none"
/>

// Branded border
<MainLayout 
  maxWidth="1024px"
  bottomNavigationBorderTop="2px solid #FF6B35"
  bottomNavigationBoxShadow="0 -4px 12px rgba(255, 107, 53, 0.2)"
/>
```

### 5. Desktop Responsive Widths
```tsx
// Tablet (768px)
<MainLayout maxWidth="768px" />

// Desktop (1024px)
<MainLayout maxWidth="1024px" />

// Large desktop (1200px)
<MainLayout maxWidth="1200px" />

// Full width
<MainLayout maxWidth="100%" />
```

## Accessibility

- Main layout container có `role="main"` và `aria-label`
- Content area có `role="main"` với aria-label thích hợp
- Header component có `role="banner"`
- BottomNavigation component có proper ARIA labels

## Performance Considerations

- MainLayout sử dụng `React.useCallback` và `React.useMemo` cho optimization
- Smooth scroll chỉ được kích hoạt khi cần thiết
- CSS transitions được tối ưu cho smooth animations
- Content area có independent scroll để tránh re-render toàn trang

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Files

- `MainLayout.tsx` - Main component implementation
- `MainLayout.css` - Styles for layout
- `MainLayout.stories.tsx` - Storybook stories
- `index.ts` - Exports
- `README.md` - Documentation

## Related Components

- [Header](../../components/Header/) - Header component
- [BottomNavigation](../../components/BottomNavigation/) - Bottom navigation component
- [Container](../../components/Container/) - Utility container component