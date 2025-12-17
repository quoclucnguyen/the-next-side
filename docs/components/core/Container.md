# Container Component

## Overview
Component container wrapper linh hoạt, cung cấp consistent spacing, responsive behavior, và layout utilities. Được sử dụng để wrap content trong toàn bộ ứng dụng với các tùy chọn layout và styling khác nhau.

## Props Interface
```typescript
interface ContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'fluid' | 'narrow' | 'wide' | 'centered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: number | string;
  backgroundColor?: string;
  borderRadius?: number | string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean | string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

interface ContainerState {
  isOverflowing: boolean;
  containerWidth: number;
  breakpoint: Breakpoint;
}

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

## State Management
```typescript
// Local state
const [containerState, setContainerState] = useState<ContainerState>({
  isOverflowing: false,
  containerWidth: 0,
  breakpoint: 'md',
});

// Responsive breakpoint detection
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useRef } from 'react';

// Internal dependencies
import { cn } from '../utils/cn';
import { useResponsive } from '../hooks/useResponsive';
import { useResizeObserver } from '../hooks/useResizeObserver';
```

## Usage Example
```typescript
const Container: React.FC<ContainerProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'none',
  maxWidth,
  backgroundColor,
  borderRadius,
  shadow = 'none',
  border = false,
  className,
  as: Component = 'div'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOverflowing, containerWidth } = useResizeObserver(containerRef);
  const breakpoint = useBreakpoint();

  const getContainerStyles = useCallback(() => {
    const styles: React.CSSProperties = {};

    // Max width based on variant
    if (maxWidth) {
      styles.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    } else {
      switch (variant) {
        case 'narrow':
          styles.maxWidth = '480px';
          break;
        case 'default':
          styles.maxWidth = '768px';
          break;
        case 'wide':
          styles.maxWidth = '1200px';
          break;
        case 'fluid':
          styles.maxWidth = '100%';
          break;
        case 'centered':
          styles.maxWidth = '1024px';
          styles.marginLeft = 'auto';
          styles.marginRight = 'auto';
          break;
      }
    }

    // Background color
    if (backgroundColor) {
      styles.backgroundColor = backgroundColor;
    }

    // Border radius
    if (borderRadius) {
      styles.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    }

    // Border
    if (border) {
      styles.border = typeof border === 'string' ? border : '1px solid var(--border-color)';
    }

    return styles;
  }, [variant, maxWidth, backgroundColor, borderRadius, border]);

  return (
    <Component
      ref={containerRef}
      className={cn(
        'container',
        getVariantClasses(variant),
        getPaddingClasses(padding),
        getMarginClasses(margin),
        getShadowClasses(shadow),
        isOverflowing && 'container--overflowing',
        className
      )}
      style={getContainerStyles()}
      role={Component === 'main' ? 'main' : Component === 'section' ? 'region' : undefined}
    >
      {children}
    </Component>
  );
};
```

## Features
### 1. Variant Classes
```typescript
const getVariantClasses = (variant: ContainerProps['variant']) => {
  const classes = [];

  switch (variant) {
    case 'fluid':
      classes.push('container--fluid');
      break;
    case 'narrow':
      classes.push('container--narrow');
      break;
    case 'wide':
      classes.push('container--wide');
      break;
    case 'centered':
      classes.push('container--centered');
      break;
    default:
      classes.push('container--default');
  }

  return classes;
};

// Spacing utilities
const getPaddingClasses = (padding: ContainerProps['padding']) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };
  return paddingMap[padding] || paddingMap.md;
};

const getMarginClasses = (margin: ContainerProps['margin']) => {
  const marginMap = {
    none: '',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-12',
  };
  return marginMap[margin] || marginMap.none;
};

const getShadowClasses = (shadow: ContainerProps['shadow']) => {
  const shadowMap = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  return shadowMap[shadow] || shadowMap.none;
};
```

### 2. Responsive Behavior
```typescript
// Responsive container adjustments
const useResponsiveContainer = () => {
  const breakpoint = useBreakpoint();

  const getResponsiveSettings = useCallback(() => {
    switch (breakpoint) {
      case 'xs':
        return {
          padding: 'sm',
          maxWidth: '100%',
          fontSize: '14px',
        };
      case 'sm':
        return {
          padding: 'md',
          maxWidth: '540px',
          fontSize: '14px',
        };
      case 'md':
        return {
          padding: 'md',
          maxWidth: '720px',
          fontSize: '16px',
        };
      case 'lg':
        return {
          padding: 'lg',
          maxWidth: '960px',
          fontSize: '16px',
        };
      case 'xl':
        return {
          padding: 'lg',
          maxWidth: '1140px',
          fontSize: '18px',
        };
      case '2xl':
        return {
          padding: 'xl',
          maxWidth: '1320px',
          fontSize: '18px',
        };
      default:
        return {
          padding: 'md',
          maxWidth: '768px',
          fontSize: '16px',
        };
    }
  }, [breakpoint]);

  return getResponsiveSettings();
};
```

### 3. Overflow Detection
```typescript
// Overflow handling hook
const useResizeObserver = (ref: React.RefObject<HTMLElement>) => {
  const [state, setState] = useState({
    isOverflowing: false,
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const isOverflowing = element.scrollWidth > element.clientWidth || 
                           element.scrollHeight > element.clientHeight;

        setState({
          isOverflowing,
          containerWidth: width,
          containerHeight: height,
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return state;
};
```

## Styling
```css
/* Base container styles */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

/* Container variants */
.container--default {
  max-width: 768px;
}

.container--narrow {
  max-width: 480px;
}

.container--wide {
  max-width: 1200px;
}

.container--fluid {
  max-width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.container--centered {
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

/* Overflow states */
.container--overflowing {
  overflow-x: auto;
  overflow-y: visible;
}

.container--overflowing::-webkit-scrollbar {
  height: 4px;
}

.container--overflowing::-webkit-scrollbar-track {
  background: var(--background-color);
}

.container--overflowing::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

/* Responsive containers */
@media (max-width: 639px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .container {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 768px) {
  .container {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 48px;
    padding-right: 48px;
  }
}

/* Specialized containers */
.container--card {
  background-color: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}

.container--section {
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.container--highlight {
  background-color: var(--highlight-color);
  border-left: 4px solid var(--primary-color);
  padding: 16px 20px;
  margin: 16px 0;
  border-radius: 0 8px 8px 0;
}

.container--glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Semantic containers */
.container--main {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.container--sidebar {
  flex: 0 0 280px;
  max-width: 280px;
  background-color: var(--sidebar-background);
  border-right: 1px solid var(--border-color);
}

.container--content {
  flex: 1;
  min-width: 0;
}

/* Print styles */
@media print {
  .container {
    max-width: none;
    padding: 0;
    box-shadow: none;
    border: none;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .container--glass {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .container {
    transition: none;
  }
}

/* Focus states */
.container:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 4px;
}
```

## Accessibility Features
```typescript
// Semantic container rendering
const AccessibleContainer: React.FC<ContainerProps> = ({
  as: Component = 'div',
  children,
  ...props
}) => {
  const getAriaProps = () => {
    const ariaProps: Record<string, any> = {};

    switch (Component) {
      case 'main':
        ariaProps['role'] = 'main';
        ariaProps['aria-label'] = 'Main content';
        break;
      case 'section':
        ariaProps['role'] = 'region';
        ariaProps['aria-label'] = props['aria-label'] || 'Content section';
        break;
      case 'article':
        ariaProps['role'] = 'article';
        ariaProps['aria-label'] = props['aria-label'] || 'Article';
        break;
      case 'aside':
        ariaProps['role'] = 'complementary';
        ariaProps['aria-label'] = props['aria-label'] || 'Sidebar';
        break;
      default:
        break;
    }

    return ariaProps;
  };

  return (
    <Component {...getAriaProps()} {...props}>
      {children}
    </Component>
  );
};

// Keyboard navigation support
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const container = containerRef.current;
  if (!container) return;

  switch (event.key) {
    case 'Home':
      event.preventDefault();
      focusFirstElement(container);
      break;
    case 'End':
      event.preventDefault();
      focusLastElement(container);
      break;
    case 'PageUp':
      event.preventDefault();
      container.scrollTop -= container.clientHeight;
      break;
    case 'PageDown':
      event.preventDefault();
      container.scrollTop += container.clientHeight;
      break;
  }
}, []);

// Focus management
const focusFirstElement = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  firstElement?.focus();
};

const focusLastElement = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  lastElement?.focus();
};
```

## Performance Optimizations
### Memoization
```typescript
// Memoize container styles
const containerStyles = useMemo(() => {
  return getContainerStyles();
}, [variant, maxWidth, backgroundColor, borderRadius, border, breakpoint]);

// Memoize class combinations
const containerClasses = useMemo(() => {
  return cn(
    'container',
    getVariantClasses(variant),
    getPaddingClasses(padding),
    getMarginClasses(margin),
    getShadowClasses(shadow),
    isOverflowing && 'container--overflowing',
    className
  );
}, [variant, padding, margin, shadow, isOverflowing, className]);

// Memoize event handlers
const handleResize = useCallback(() => {
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    setContainerState(prev => ({
      ...prev,
      containerWidth: rect.width,
    }));
  }
}, []);
```

### Virtualization
```typescript
// Optimize for large content
const VirtualizedContainer: React.FC<ContainerProps> = ({ children, ...props }) => {
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  useEffect(() => {
    // Enable virtualization for large lists
    const childCount = React.Children.count(children);
    setShouldVirtualize(childCount > 50);
  }, [children]);

  if (shouldVirtualize) {
    return (
      <Container {...props}>
        <FixedSizeList
          height={400}
          itemCount={React.Children.count(children)}
          itemSize={60}
        >
          {({ index, style }) => (
            <div style={style}>
              {React.Children.toArray(children)[index]}
            </div>
          )}
        </FixedSizeList>
      </Container>
    );
  }

  return <Container {...props}>{children}</Container>;
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('Container Component', () => {
  test('renders children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies correct variant classes', () => {
    render(<Container variant="narrow"><div>Content</div></Container>);
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('container--narrow');
  });

  test('applies correct padding classes', () => {
    render(<Container padding="lg"><div>Content</div></Container>);
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('p-8');
  });

  test('detects overflow correctly', () => {
    render(
      <Container>
        <div style={{ width: '2000px' }}>Wide content</div>
      </Container>
    );
    const container = screen.getByText('Wide content').parentElement;
    expect(container).toHaveClass('container--overflowing');
  });

  test('renders as different HTML elements', () => {
    render(<Container as="main"><div>Main Content</div></Container>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('applies custom styles correctly', () => {
    render(
      <Container backgroundColor="#ff0000" borderRadius={8}>
        <div>Content</div>
      </Container>
    );
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(container).toHaveStyle('border-radius: 8px');
  });
});
```

### Integration Tests
```typescript
describe('Container Integration', () => {
  test('responsive behavior works', () => {
    render(<Container><div>Content</div></Container>);
    
    // Simulate different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });
    
    fireEvent(window, new Event('resize'));
    
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('p-4'); // sm padding on mobile
  });

  test('handles dynamic content changes', () => {
    const { rerender } = render(<Container><div>Initial</div></Container>);
    
    rerender(<Container><div>Updated</div></Container>);
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

## Error Handling
```typescript
// Error boundary for container
const ContainerErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="container container--error">
          <p>Error rendering container content</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Safe container rendering
const SafeContainer: React.FC<ContainerProps> = (props) => {
  try {
    return <Container {...props} />;
  } catch (error) {
    console.error('Container error:', error);
    return (
      <div className="container container--fallback">
        {props.children}
      </div>
    );
  }
};
```

## Documentation Links
- [App Component](./App.md)
- [Layout Component](./Layout.md)
- [Responsive Design Guide](../overview/ResponsiveDesign.md)
- [Accessibility Guidelines](../overview/Accessibility.md)
- [Performance Guide](../overview/Performance.md)
