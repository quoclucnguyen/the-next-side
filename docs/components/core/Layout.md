# Layout Component

## Overview
Component layout chính của ứng dụng, chịu trách nhiệm cấu trúc tổng thể bao gồm header, content area và bottom navigation. Đảm bảo responsive design và consistent spacing trên toàn ứng dụng.

## Props Interface
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  headerTitle?: string;
  onBackPress?: () => void;
  backgroundColor?: string;
  className?: string;
}

interface LayoutState {
  isKeyboardVisible: boolean;
  screenHeight: number;
  isLandscape: boolean;
}
```

## State Management
```typescript
// Local state
const [layoutState, setLayoutState] = useState<LayoutState>({
  isKeyboardVisible: false,
  screenHeight: window.innerHeight,
  isLandscape: window.innerWidth > window.innerHeight,
});

// Global state interaction
const { activeTab } = useSelector((state: RootState) => state.navigation);
const { user } = useSelector((state: RootState) => state.auth);
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// Internal dependencies
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { useKeyboardDetection } from '../hooks/useKeyboardDetection';
import { useResponsive } from '../hooks/useResponsive';
import { cn } from '../utils/cn';
```

## Usage Example
```typescript
const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  headerTitle,
  onBackPress,
  backgroundColor = '#FFFFFF',
  className
}) => {
  const { isKeyboardVisible } = useKeyboardDetection();
  const { isMobile, isTablet } = useResponsive();

  return (
    <div 
      className={cn(
        'layout',
        'flex flex-col min-h-screen',
        backgroundColor,
        className
      )}
      style={{
        paddingBottom: showBottomNav && !isKeyboardVisible ? '60px' : '0'
      }}
    >
      {showHeader && (
        <Header
          title={headerTitle}
          onBackPress={onBackPress}
          showBackButton={!!onBackPress}
        />
      )}
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {showBottomNav && !isKeyboardVisible && (
        <BottomNavigation />
      )}
    </div>
  );
};
```

## Features
### 1. Responsive Design
```typescript
// Breakpoint management
const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

// Adaptive layout
const getLayoutConfig = () => {
  if (isMobile) {
    return {
      padding: '16px',
      headerHeight: '56px',
      bottomNavHeight: '60px',
    };
  } else if (isTablet) {
    return {
      padding: '24px',
      headerHeight: '64px',
      bottomNavHeight: '72px',
    };
  } else {
    return {
      padding: '32px',
      headerHeight: '72px',
      bottomNavHeight: '80px',
    };
  }
};
```

### 2. Keyboard Detection
```typescript
// Keyboard visibility handling
useEffect(() => {
  const handleKeyboardShow = () => {
    setLayoutState(prev => ({ ...prev, isKeyboardVisible: true }));
  };

  const handleKeyboardHide = () => {
    setLayoutState(prev => ({ ...prev, isKeyboardVisible: false }));
  };

  window.addEventListener('keyboardshow', handleKeyboardShow);
  window.addEventListener('keyboardhide', handleKeyboardHide);

  return () => {
    window.removeEventListener('keyboardshow', handleKeyboardShow);
    window.removeEventListener('keyboardhide', handleKeyboardHide);
  };
}, []);
```

### 3. Screen Orientation
```typescript
// Orientation detection
useEffect(() => {
  const handleOrientationChange = () => {
    setLayoutState(prev => ({
      ...prev,
      isLandscape: window.innerWidth > window.innerHeight,
      screenHeight: window.innerHeight,
    }));
  };

  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('orientationchange', handleOrientationChange);

  return () => {
    window.removeEventListener('resize', handleOrientationChange);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
}, []);
```

## Styling
```css
/* Layout container */
.layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--background-color);
  transition: all 0.3s ease;
}

/* Main content area */
.layout__main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: var(--content-padding);
}

/* Header area */
.layout__header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

/* Bottom navigation */
.layout__bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.layout__bottom-nav--hidden {
  transform: translateY(100%);
}

/* Keyboard adjustments */
.layout--keyboard-visible {
  height: calc(100vh - var(--keyboard-height));
}

.layout--keyboard-visible .layout__bottom-nav {
  display: none;
}

/* Responsive variations */
@media (min-width: 768px) {
  .layout {
    max-width: 768px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  .layout {
    max-width: 1024px;
  }
}

/* Landscape mode */
@media (orientation: landscape) {
  .layout {
    min-height: 100vh;
    max-height: 100vh;
  }
  
  .layout__main {
    max-height: calc(100vh - var(--header-height) - var(--bottom-nav-height));
  }
}
```

## Accessibility Features
```typescript
// ARIA labels and landmarks
const Layout: React.FC<LayoutProps> = ({ children, ...props }) => {
  return (
    <div 
      className="layout"
      role="application"
      aria-label="Pantry Management App"
    >
      <header 
        className="layout__header"
        role="banner"
        aria-label="App header"
      >
        <Header {...props} />
      </header>
      
      <main 
        className="layout__main"
        role="main"
        aria-label="Main content"
        tabIndex={-1}
      >
        {children}
      </main>
      
      <nav 
        className="layout__bottom-nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <BottomNavigation />
      </nav>
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      // Handle escape key
      break;
    case 'Tab':
      // Handle tab navigation
      break;
    default:
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize layout calculations
const layoutConfig = useMemo(() => getLayoutConfig(), [isMobile, isTablet]);

// Memoize style calculations
const containerStyle = useMemo(() => ({
  paddingBottom: showBottomNav && !isKeyboardVisible 
    ? layoutConfig.bottomNavHeight 
    : '0',
  backgroundColor,
}), [showBottomNav, isKeyboardVisible, layoutConfig, backgroundColor]);
```

### Virtual Scrolling
```typescript
// For large lists in main content
const VirtualizedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVirtualScrollEnabled, setIsVirtualScrollEnabled] = useState(false);

  useEffect(() => {
    // Enable virtual scrolling for performance
    if (children && Array.isArray(children) && children.length > 100) {
      setIsVirtualScrollEnabled(true);
    }
  }, [children]);

  if (isVirtualScrollEnabled) {
    return <VirtualizedList>{children}</VirtualizedList>;
  }

  return <>{children}</>;
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('Layout Component', () => {
  test('renders children correctly', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('shows header when showHeader is true', () => {
    render(<Layout showHeader><div>Content</div></Layout>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('hides bottom navigation when keyboard is visible', () => {
    render(<Layout><div>Content</div></Layout>);
    // Mock keyboard visible
    fireEvent(window, new Event('keyboardshow'));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('Layout Integration', () => {
  test('responsive design works', () => {
    // Test different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    
    render(<Layout><div>Content</div></Layout>);
    expect(screen.getByRole('application')).toHaveClass('layout--tablet');
  });

  test('keyboard interactions', () => {
    render(<Layout><div>Content</div></Layout>);
    const layout = screen.getByRole('application');
    
    fireEvent.keyDown(layout, { key: 'Tab' });
    // Test keyboard navigation
  });
});
```

## Error Handling
```typescript
// Error boundary for layout
const LayoutErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="layout__error">
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
```

## Animation & Transitions
```typescript
// Smooth transitions
const AnimatedLayout: React.FC<LayoutProps> = ({ children, ...props }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <motion.div
      className="layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Layout {...props}>
        {children}
      </Layout>
    </motion.div>
  );
};
```

## Development Tools
```typescript
// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Layout debugging
  const LayoutDebugger: React.FC = () => {
    const { isKeyboardVisible, screenHeight, isLandscape } = useLayoutState();
    
    return (
      <div className="layout__debugger">
        <p>Keyboard: {isKeyboardVisible ? 'Visible' : 'Hidden'}</p>
        <p>Screen Height: {screenHeight}px</p>
        <p>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</p>
      </div>
    );
  };
}
```

## Documentation Links
- [App Component](./App.md)
- [Header Component](./Header.md)
- [BottomNavigation Component](./BottomNavigation.md)
- [Responsive Design Guide](../overview/ResponsiveDesign.md)
- [Accessibility Guidelines](../overview/Accessibility.md)
