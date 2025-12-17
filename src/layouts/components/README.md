# Header Component

Một Header component linh hoạt và đa năng cho Pantry App, được xây dựng với React và Ant Design Mobile.

## Features

- 🎨 **Responsive Design** - Tương thích với mọi kích thước màn hình
- 📱 **Mobile-First** - Tối ưu cho trải nghiệm mobile
- 🔄 **Scroll Behavior** - Ẩn/hiện header dựa trên cuộn
- 🎯 **Route Integration** - Tự động cập nhật title theo route
- ♿ **Accessibility** - Hỗ trợ đầy đủ cho screen readers
- 🎨 **Customizable** - Hỗ trợ custom styles và colors

## Installation

```bash
npm install antd-mobile react-router-dom
```

## Basic Usage

```tsx
import { Header } from '@/layouts/components';

function App() {
  return (
    <Header title="My Page" />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Pantry App'` | Title của header |
| `showBackButton` | `boolean` | `false` | Hiển thị nút back |
| `onBackPress` | `() => void` | `navigate(-1)` | Callback khi back button được click |
| `rightComponent` | `ReactNode` | `null` | Component bên phải header |
| `backgroundColor` | `string` | `'#FFFFFF'` | Màu nền header |
| `textColor` | `string` | `'#333333'` | Màu chữ header |
| `borderColor` | `string` | `'#E0E0E0'` | Màu border header |
| `height` | `number` | `56` | Chiều cao header (px) |
| `className` | `string` | `''` | Custom CSS classes |

## Advanced Usage

### With Back Button

```tsx
<Header 
  title="Product Details"
  showBackButton
  onBackPress={() => navigate('/products')}
/>
```

### With Right Component

```tsx
import { HeaderSearchButton } from '@/layouts/components';

<Header 
  title="My Pantry"
  rightComponent={<HeaderSearchButton />}
/>
```

### Custom Styling

```tsx
<Header 
  title="Custom Header"
  backgroundColor="#1a73e8"
  textColor="#ffffff"
  borderColor="#1a73e8"
  height={64}
  className="custom-header"
/>
```

### Route-Based Title

Header sẽ tự động hiển thị title dựa trên current route:

| Route | Title |
|-------|--------|
| `/` | `'Pantry App'` |
| `/pantry` | `'My Pantry'` |
| `/search` | `'Search'` |
| `/recipes` | `'Recipes'` |
| `/profile` | `'Profile'` |
| `/add-product` | `'Add Product'` |
| `/product/:id` | `'Product Details'` |

## Sub-components

### HeaderSearchButton

Nút search điều hướng đến trang search.

```tsx
import { HeaderSearchButton } from '@/layouts/components';

<HeaderSearchButton />
```

### HeaderMenuButton

Nút menu với custom toggle handler.

```tsx
import { HeaderMenuButton } from '@/layouts/components';

<HeaderMenuButton onToggle={() => setMenuOpen(!menuOpen)} />
```

### HeaderEditButton

Nút edit với custom edit handler.

```tsx
import { HeaderEditButton } from '@/layouts/components';

<HeaderEditButton onEdit={() => setEditMode(true)} />
```

## Scroll Behavior

Header có thể tự động ẩn khi scroll down và hiện khi scroll up:

```tsx
import { useScrollPosition } from '@/hooks/useScrollPosition';

// Custom threshold và debounce
const { scrollDirection, isScrolled } = useScrollPosition({
  threshold: 50,
  debounceMs: 100,
});
```

## Accessibility

- Semantic HTML5 (`<header>` với `role="banner"`)
- ARIA labels cho screen readers
- Keyboard navigation support
- Focus management
- Screen reader text cho back button

## CSS Classes

Các class có thể được dùng để custom styling:

```css
.header {
  /* Base header styles */
}

.header--scrolled {
  /* Styles khi scrolled */
}

.header--hidden {
  /* Styles khi ẩn */
}

.header__content {
  /* Container nội dung */
}

.header__left {
  /* Phần bên trái */
}

.header__right {
  /* Phần bên phải */
}

.header__title {
  /* Title text */
}

.header__back-button {
  /* Back button */
}
```

## Examples

### Kitchen Sink

```tsx
import { 
  Header, 
  HeaderSearchButton, 
  HeaderMenuButton 
} from '@/layouts/components';

function ComplexHeader() {
  const rightContent = (
    <div style={{ display: 'flex', gap: '8px' }}>
      <HeaderSearchButton />
      <HeaderMenuButton onToggle={toggleMenu} />
    </div>
  );

  return (
    <Header
      title="Advanced Example"
      showBackButton
      rightComponent={rightContent}
      backgroundColor="#f8f9fa"
      textColor="#212529"
      onBackPress={handleCustomBack}
    />
  );
}
```

## Dependencies

- `react` >= 18.0.0
- `react-router-dom` >= 6.0.0
- `antd-mobile` >= 5.0.0
- `antd-mobile-icons`

## Browser Support

- Chrome >= 88
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## Contributing

Khi thêm tính năng mới:

1. Cập nhật TypeScript interfaces
2. Thêm props documentation
3. Cập nhật examples
4. Test accessibility
5. Cập nhật Storybook stories

## License

MIT License - xem LICENSE file để biết chi tiết.
