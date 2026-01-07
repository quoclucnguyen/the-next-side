# BottomNavigation Component

BottomNavigation là một component điều hướng chính của ứng dụng, cung cấp điều hướng nhanh giữa các màn hình chính với 5 tab: Home, Search, Add, Recipes, và Profile.

## Features

- **Desktop Support**: Hỗ trợ responsive với custom maxWidth cho desktop view
- **Flexible Styling**: Tùy chỉnh màu sắc, border, radius, và shadow
- **Controlled & Uncontrolled Mode**: Hỗ trợ cả controlled và uncontrolled mode
- **Haptic Feedback**: Haptic feedback khi chuyển tab
- **Safe Area Support**: Hỗ trợ safe area cho iOS devices với notch
- **Custom Position**: Hỗ trợ fixed, sticky, và relative position
- **Accessibility**: Full ARIA labels và keyboard navigation support

## Props

### BottomNavigationProps

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `activeTab` | `NavigationTab` | `undefined` | Tab đang active (controlled mode) |
| `onTabChange` | `(tab: NavigationTab) => void` | `undefined` | Callback khi tab thay đổi |
| `backgroundColor` | `string` | `"#FFFFFF"` | Màu nền của navigation |
| `activeColor` | `string` | `"#FF6B35"` | Màu của tab active |
| `height` | `number` | `56` | Chiều cao của navigation (pixels) |
| `showLabels` | `boolean` | `true` | Hiển thị label cho các tab |
| `safeArea` | `boolean` | `true` | Bật safe area cho thiết bị có notch |
| `className` | `string` | `undefined` | Custom class names |
| `maxWidth` | `number \| string` | `undefined` | Max width của container (desktop view) |
| `borderTop` | `string` | `"1px solid rgba(0, 0, 0, 0.1)"` | Border top styling |
| `borderRadius` | `string` | `"0"` | Border radius cho corners |
| `boxShadow` | `string` | `"0 -2px 8px rgba(0, 0, 0, 0.08)"` | Box shadow styling |
| `position` | `'fixed' \| 'sticky' \| 'relative'` | `'fixed'` | Position type của navigation |

## Usage Examples

### Basic Usage

```tsx
import { BottomNavigation } from '@/components/BottomNavigation';

function App() {
  return (
    <>
      {/* Your app content */}
      <BottomNavigation />
    </>
  );
}
```

### Desktop View với Custom Width

```tsx
import { BottomNavigation } from '@/components/BottomNavigation';

function App() {
  return (
    <BottomNavigation 
      maxWidth="1024px"
      backgroundColor="#FFFFFF"
    />
  );
}
```

### Custom Styling

```tsx
<BottomNavigation 
  maxWidth="1024px"
  backgroundColor="#FFFFFF"
  borderTop="2px solid #FF6B35"
  borderRadius="8px 8px 0 0"
  boxShadow="0 -4px 12px rgba(255, 107, 53, 0.2)"
/>
```

### Dark Theme

```tsx
<BottomNavigation 
  maxWidth="1024px"
  backgroundColor="#2D2D2D"
  activeColor="#FF6B35"
  borderTop="1px solid #404040"
  boxShadow="0 -2px 8px rgba(0, 0, 0, 0.4)"
/>
```

### Minimal Style

```tsx
<BottomNavigation 
  backgroundColor="#FFFFFF"
  borderTop="none"
  boxShadow="none"
/>
```

### Controlled Mode

```tsx
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");

  return (
    <BottomNavigation 
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        // Navigate to tab route
      }}
    />
  );
}
```

### Without Labels

```tsx
<BottomNavigation 
  showLabels={false}
  height={48}
/>
```

### Sticky Position

```tsx
<BottomNavigation 
  position="sticky"
  backgroundColor="#FFFFFF"
  boxShadow="0 -2px 8px rgba(0, 0, 0, 0.08)"
/>
```

## Integration với MainLayout

Khi sử dụng với MainLayout, BottomNavigation tự động nhận `maxWidth` từ MainLayout:

```tsx
import { MainLayout } from '@/layouts/MainLayout';

function App() {
  return (
    <MainLayout 
      maxWidth="1024px"
      bottomNavigationProps={{
        backgroundColor: "#FFFFFF",
        activeColor: "#FF6B35"
      }}
    >
      {/* Your content */}
    </MainLayout>
  );
}
```

## Responsive Behavior

### Mobile (default)
- Full width container
- Fixed position ở bottom
- Height: 56px
- Safe area padding (nếu enabled)

### Desktop (≥768px với maxWidth)
- Centered container với custom maxWidth
- Fixed position ở bottom
- Border top styling
- Box shadow cho visual separation
- Optional rounded corners

## Tab Configuration

BottomNavigation có 5 default tabs:

| ID | Label | Route | Icon |
|----|-------|-------|------|
| `home` | Home | `/` | StarOutline |
| `search` | Search | `/search` | SearchOutline |
| `add` | Add | `/add-product` | AddOutline |
| `recipes` | Recipes | `/recipes` | AppOutline |
| `profile` | Profile | `/profile` | UserOutline |

## Customization Tips

### 1. Tablet View (768px)

```tsx
<BottomNavigation 
  maxWidth="768px"
  backgroundColor="#FFFFFF"
/>
```

### 2. Large Desktop (1200px)

```tsx
<BottomNavigation 
  maxWidth="1200px"
  backgroundColor="#FFFFFF"
/>
```

### 3. Modern Rounded Look

```tsx
<BottomNavigation 
  maxWidth="1024px"
  backgroundColor="#FFFFFF"
  borderRadius="16px 16px 0 0"
  boxShadow="0 -4px 16px rgba(0, 0, 0, 0.1)"
/>
```

### 4. Branded Primary Color

```tsx
<BottomNavigation 
  backgroundColor="#FF6B35"
  activeColor="#FFFFFF"
/>
```

## Haptic Feedback

BottomNavigation tự động kích hoạt haptic feedback (vibration) khi người dùng tap vào tab trên thiết bị hỗ trợ.

### Haptic Types

- **Selection**: 10ms vibration - khi tap vào tab
- **Impact**: 25ms vibration - khi có significant interaction
- **Notification**: `[50, 50, 50]ms` - khi có notification

## Accessibility

- ARIA labels cho từng tab
- Keyboard navigation support
- Focus states cho screen readers
- Role="navigation" với proper labeling

## Performance Considerations

- Icons được memoized với transitions
- Container classes được cache với `useCallback`
- Minimal re-renders với proper dependency arrays
- CSS transitions cho smooth animations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Haptic feedback: Chỉ trên thiết bị hỗ trợ (đa phần là mobile)

## Files

- `BottomNavigation.tsx` - Main component implementation
- `BottomNavigation.stories.tsx` - Storybook stories
- `index.ts` - Exports
- `README.md` - Documentation

## Related Components

- [MainLayout](../../../layouts/MainLayout/) - Main layout component
- [Header](../Header/) - Header component
- [Container](../Container/) - Utility container component

## Storybook Stories

- **Default** - Basic usage với default settings
- **DesktopView** - Desktop view với custom maxWidth
- **CustomWidth768** - Tablet view với 768px width
- **CustomWidth1200** - Large desktop với 1200px width
- **CustomStyling** - Custom border, radius, và shadow
- **DarkTheme** - Dark theme styling
- **Minimal** - Minimal styling (no border/shadow)
- **RoundedTopCorners** - Modern rounded corners
- **StickyPosition** - Sticky position demo
- **WithoutLabels** - Icons only mode
- **Controlled** - Controlled mode example
- **Playground** - Interactive playground

## Migration Guide

### From Default to Desktop View

**Before:**
```tsx
<BottomNavigation />
```

**After:**
```tsx
<BottomNavigation 
  maxWidth="1024px"
  backgroundColor="#FFFFFF"
/>
```

### From Default to Custom Styling

**Before:**
```tsx
<BottomNavigation 
  backgroundColor="#FFFFFF"
/>
```

**After:**
```tsx
<BottomNavigation 
  maxWidth="1024px"
  backgroundColor="#FFFFFF"
  borderTop="2px solid #FF6B35"
  borderRadius="8px 8px 0 0"
  boxShadow="0 -4px 12px rgba(255, 107, 53, 0.2)"
/>
```

## Troubleshooting

### Q: BottomNavigation không centered trên desktop?

A: Đảm bảo bạn đang truyền prop `maxWidth`. Nếu không set, nó sẽ dùng default `max-w-md`.

```tsx
<BottomNavigation maxWidth="1024px" />
```

### Q: Border không hiển thị?

A: Kiểm tra xem bạn có override `borderTop` prop hay không:

```tsx
<BottomNavigation borderTop="1px solid rgba(0, 0, 0, 0.1)" />
```

### Q: Safe area không hoạt động?

A: Đảm bảo `safeArea` prop là `true` (default):

```tsx
<BottomNavigation safeArea={true} />
```

### Q: Haptic feedback không hoạt động?

A: Haptic feedback chỉ hoạt động trên thiết bị hỗ trợ và trong browser có quyền vibration. Kiểm tra trong DevTools:

```javascript
navigator.vibrate(10); // Test haptic feedback
```

## Best Practices

1. **Luôn dùng với React Router**: BottomNavigation hoạt động tốt nhất với React Router để auto-detect active tab
2. **Responsive Width**: Sử dụng `maxWidth` prop để control width trên desktop
3. **Consistent Styling**: Giữ consistent styling giữa BottomNavigation và Header
4. **Accessibility**: Luôn giữ labels cho screen readers, kể cả khi ẩn visual labels
5. **Performance**: Sử dụng uncontrolled mode khi không cần manual tab control

## Future Enhancements

- Badge support cho từng tab
- Custom tab configuration (add/remove tabs)
- Animated transitions giữa tabs
- Vertical layout option
- Floating action button integration
- Custom icons support