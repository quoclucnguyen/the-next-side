# Header Component

## Overview
Component header của ứng dụng, hiển thị tiêu đề trang, nút back (nếu có), và các action buttons. Đảm bảo consistent navigation và clear visual hierarchy.

## Props Interface
```typescript
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  height?: number;
  className?: string;
}

interface HeaderState {
  isScrolled: boolean;
  isVisible: boolean;
  title: string;
}
```

## State Management
```typescript
// Local state
const [headerState, setHeaderState] = useState<HeaderState>({
  isScrolled: false,
  isVisible: true,
  title: title || '',
});

// Global state interaction
const { canGoBack } = useSelector((state: RootState) => state.navigation);
const { user } = useSelector((state: RootState) => state.auth);
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Internal dependencies
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { cn } from '../utils/cn';
import { useScrollPosition } from '../hooks/useScrollPosition';
```

## Usage Example
```typescript
const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  backgroundColor = '#FFFFFF',
  textColor = '#333333',
  borderColor = '#E0E0E0',
  height = 56,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolled } = useScrollPosition();

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigate(-1);
    }
  }, [navigate, onBackPress]);

  return (
    <header
      className={cn(
        'header',
        'sticky top-0 z-50',
        'flex items-center justify-between',
        'px-4',
        backgroundColor,
        textColor,
        isScrolled && 'header--scrolled',
        className
      )}
      style={{
        height: `${height}px`,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      {/* Left side - Back button */}
      <div className="header__left flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onPress={handleBackPress}
            className="header__back-button"
            aria-label="Go back"
          >
            <Icon name="arrow-back" size={24} />
          </Button>
        )}
      </div>

      {/* Center - Title */}
      <div className="header__center flex-1 text-center">
        <h1 className="header__title text-lg font-semibold truncate">
          {title}
        </h1>
      </div>

      {/* Right side - Action buttons */}
      <div className="header__right flex items-center">
        {rightComponent}
      </div>
    </header>
  );
};
```

## Features
### 1. Dynamic Title Updates
```typescript
// Title synchronization with route
useEffect(() => {
  const routeTitle = getRouteTitle(location.pathname);
  setHeaderState(prev => ({ ...prev, title: routeTitle || title || '' }));
}, [location.pathname, title]);

// Breadcrumb support
const getBreadcrumbs = () => {
  const pathSegments = location.pathname.split('/').filter(Boolean);
  return pathSegments.map((segment, index) => ({
    label: formatSegmentName(segment),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));
};
```

### 2. Scroll Behavior
```typescript
// Hide/show on scroll
const { scrollDirection, isScrolled } = useScrollPosition({
  threshold: 50,
  debounceMs: 100,
});

useEffect(() => {
  if (scrollDirection === 'down' && isScrolled) {
    setHeaderState(prev => ({ ...prev, isVisible: false }));
  } else if (scrollDirection === 'up') {
    setHeaderState(prev => ({ ...prev, isVisible: true }));
  }
}, [scrollDirection, isScrolled]);
```

### 3. Action Buttons
```typescript
// Common right components
const SearchButton: React.FC = () => (
  <Button
    variant="ghost"
    size="sm"
    onPress={() => navigate('/search')}
    aria-label="Search"
  >
    <Icon name="search" size={24} />
  </Button>
);

const MenuButton: React.FC = () => (
  <Button
    variant="ghost"
    size="sm"
    onPress={() => toggleMenu()}
    aria-label="Menu"
  >
    <Icon name="menu" size={24} />
  </Button>
);

const EditButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <Button
    variant="ghost"
    size="sm"
    onPress={onPress}
    aria-label="Edit"
  >
    <Icon name="edit" size={24} />
  </Button>
);
```

## Styling
```css
/* Header container */
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: var(--background-color);
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  backdrop-filter: blur(0);
}

.header--scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header--hidden {
  transform: translateY(-100%);
}

/* Header sections */
.header__left {
  display: flex;
  align-items: center;
  min-width: 48px;
  justify-content: flex-start;
}

.header__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0; /* Allow truncation */
}

.header__right {
  display: flex;
  align-items: center;
  min-width: 48px;
  justify-content: flex-end;
}

/* Title styling */
.header__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Back button */
.header__back-button {
  margin-right: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.header__back-button:active {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    padding: 0 12px;
  }
  
  .header__title {
    font-size: 16px;
  }
  
  .header__left,
  .header__right {
    min-width: 40px;
  }
}

@media (min-width: 769px) {
  .header {
    padding: 0 24px;
    height: 64px;
  }
  
  .header__title {
    font-size: 20px;
  }
}

/* Theme variations */
.header--dark {
  background-color: #1a1a1a;
  color: #ffffff;
  border-bottom-color: #333333;
}

.header--primary {
  background-color: var(--primary-color);
  color: #ffffff;
  border-bottom-color: var(--primary-color);
}

.header--transparent {
  background-color: transparent;
  border-bottom-color: transparent;
}

/* Animation states */
.header__title {
  transition: opacity 0.2s ease;
}

.header__title--loading {
  opacity: 0.6;
}

/* Focus states */
.header__back-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

## Accessibility Features
```typescript
// ARIA labels and roles
const AccessibleHeader: React.FC<HeaderProps> = (props) => {
  return (
    <header
      role="banner"
      aria-label={`${props.title} page header`}
      aria-level={1}
      {...props}
    >
      {/* Back button accessibility */}
      {showBackButton && (
        <Button
          aria-label={`Go back to previous page from ${title}`}
          aria-describedby="back-help-text"
        >
          <Icon name="arrow-back" aria-hidden="true" />
        </Button>
      )}
      
      {/* Title accessibility */}
      <h1 className="header__title" id="page-title">
        {title}
      </h1>
      
      {/* Hidden help text */}
      <span id="back-help-text" className="sr-only">
        Navigate to previous screen
      </span>
    </header>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      handleBackPress();
      break;
    case 'ArrowLeft':
      if (document.activeElement === headerRef.current) {
        focusBackButton();
      }
      break;
    case 'ArrowRight':
      if (document.activeElement === headerRef.current) {
        focusRightButton();
      }
      break;
  }
}, [handleBackPress]);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize expensive calculations
const headerStyle = useMemo(() => ({
  height: `${height}px`,
  backgroundColor,
  color: textColor,
  borderBottom: `1px solid ${borderColor}`,
}), [height, backgroundColor, textColor, borderColor]);

// Memoize event handlers
const handleBackPress = useCallback(() => {
  if (onBackPress) {
    onBackPress();
  } else {
    navigate(-1);
  }
}, [navigate, onBackPress]);
```

### Virtualization
```typescript
// Optimize for frequent updates
const OptimizedHeader = React.memo(Header, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.showBackButton === nextProps.showBackButton &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.rightComponent === nextProps.rightComponent
  );
});
```

## Testing Strategy
### Unit Tests
```typescript
describe('Header Component', () => {
  test('renders title correctly', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('shows back button when showBackButton is true', () => {
    render(<Header showBackButton title="Test" />);
    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
  });

  test('calls onBackPress when back button is clicked', () => {
    const mockOnBackPress = jest.fn();
    render(<Header showBackButton onBackPress={mockOnBackPress} />);
    
    fireEvent.click(screen.getByLabelText('Go back'));
    expect(mockOnBackPress).toHaveBeenCalledTimes(1);
  });

  test('navigates back when no onBackPress provided', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(<Header showBackButton />);
    fireEvent.click(screen.getByLabelText('Go back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
```

### Integration Tests
```typescript
describe('Header Integration', () => {
  test('updates title on route change', () => {
    const { rerender } = render(
      <Router>
        <Header title="Home" />
      </Router>
    );
    
    expect(screen.getByRole('heading')).toHaveTextContent('Home');
    
    rerender(
      <Router>
        <Header title="Products" />
      </Router>
    );
    
    expect(screen.getByRole('heading')).toHaveTextContent('Products');
  });

  test('scroll behavior works correctly', () => {
    render(<Header title="Test" />);
    
    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    
    expect(screen.getByRole('banner')).toHaveClass('header--scrolled');
  });
});
```

## Error Handling
```typescript
// Error boundary for header
const HeaderErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <header className="header header--error">
          <div className="header__center">
            <span className="header__title">Error loading header</span>
          </div>
        </header>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Fallback rendering
const SafeHeader: React.FC<HeaderProps> = (props) => {
  try {
    return <Header {...props} />;
  } catch (error) {
    console.error('Header error:', error);
    return (
      <header className="header">
        <h1 className="header__title">Pantry App</h1>
      </header>
    );
  }
};
```

## Animation & Transitions
```typescript
// Smooth transitions
const AnimatedHeader: React.FC<HeaderProps> = ({ title, ...props }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(title);

  useEffect(() => {
    if (title !== displayTitle) {
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayTitle(title);
        setIsAnimating(false);
      }, 150);
    }
  }, [title, displayTitle]);

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.h1
        className="header__title"
        animate={{ opacity: isAnimating ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {displayTitle}
      </motion.h1>
    </motion.header>
  );
};
```

## Development Tools
```typescript
// Development helpers
if (process.env.NODE_ENV === 'development') {
  const HeaderDebugger: React.FC<HeaderProps> = (props) => {
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
      setDebugInfo({
        title: props.title,
        showBackButton: props.showBackButton,
        hasRightComponent: !!props.rightComponent,
        scrollPosition: window.scrollY,
      });
    }, [props]);

    return (
      <>
        <Header {...props} />
        {process.env.SHOW_HEADER_DEBUG && (
          <div className="header__debugger">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </>
    );
  };
}
```

## Documentation Links
- [App Component](./App.md)
- [Layout Component](./Layout.md)
- [Button Component](../common/Button.md)
- [Icon Component](../common/Icon.md)
- [Responsive Design Guide](../overview/ResponsiveDesign.md)
