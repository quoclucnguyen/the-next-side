# BottomNavigation Component

## Overview
Component bottom navigation chính của ứng dụng, cung cấp điều hướng nhanh giữa các màn hình chính. Hiển thị 5 tab: Home, Search, Add, Recipes, và Profile. Đảm bảo consistent navigation experience và visual feedback.

## Props Interface
```typescript
interface BottomNavigationProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

type NavigationTab = 'home' | 'search' | 'add' | 'recipes' | 'profile';

interface TabConfig {
  id: NavigationTab;
  label: string;
  icon: string;
  activeIcon?: string;
  route: string;
  badge?: number;
  disabled?: boolean;
}

interface BottomNavigationState {
  activeTab: NavigationTab;
  isAnimating: boolean;
  tabs: TabConfig[];
}
```

## State Management
```typescript
// Local state
const [navState, setNavState] = useState<BottomNavigationState>({
  activeTab: 'home',
  isAnimating: false,
  tabs: [
    { id: 'home', label: 'Home', icon: 'home', route: '/' },
    { id: 'search', label: 'Search', icon: 'search', route: '/search' },
    { id: 'add', label: 'Add', icon: 'add', route: '/add-product' },
    { id: 'recipes', label: 'Recipes', icon: 'book', route: '/recipes' },
    { id: 'profile', label: 'Profile', icon: 'person', route: '/profile' },
  ],
});

// Global state interaction
const { activeTab: globalActiveTab } = useSelector((state: RootState) => state.navigation);
const { notificationCount } = useSelector((state: RootState) => state.notifications);
const dispatch = useDispatch();
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Internal dependencies
import { Icon } from '../common/Icon';
import { Badge } from '../common/Badge';
import { cn } from '../utils/cn';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTabBadge } from '../hooks/useTabBadge';
```

## Usage Example
```typescript
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  backgroundColor = '#FFFFFF',
  activeColor = '#FF6B35',
  inactiveColor = '#666666',
  height = 60,
  showLabels = true,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHapticFeedback();

  const handleTabPress = useCallback((tab: TabConfig) => {
    if (tab.disabled) return;

    triggerHaptic('selection');
    
    if (onTabChange) {
      onTabChange(tab.id);
    } else {
      navigate(tab.route);
    }
  }, [navigate, onTabChange, triggerHaptic]);

  const getCurrentTab = useCallback(() => {
    if (activeTab) return activeTab;
    
    const currentPath = location.pathname;
    const tab = navState.tabs.find(t => 
      t.route === currentPath || currentPath.startsWith(t.route + '/')
    );
    
    return tab?.id || 'home';
  }, [activeTab, location.pathname, navState.tabs]);

  return (
    <nav
      className={cn(
        'bottom-navigation',
        'fixed bottom-0 left-0 right-0',
        'flex items-center justify-around',
        'border-t border-gray-200',
        backgroundColor,
        className
      )}
      style={{
        height: `${height}px`,
        backgroundColor,
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {navState.tabs.map((tab) => {
        const isActive = getCurrentTab() === tab.id;
        
        return (
          <NavigationTabItem
            key={tab.id}
            tab={tab}
            isActive={isActive}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
            showLabels={showLabels}
            onPress={() => handleTabPress(tab)}
          />
        );
      })}
    </nav>
  );
};
```

## Features
### 1. Tab Item Component
```typescript
interface NavigationTabItemProps {
  tab: TabConfig;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  showLabels: boolean;
  onPress: () => void;
}

const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
  tab,
  isActive,
  activeColor,
  inactiveColor,
  showLabels,
  onPress
}) => {
  return (
    <button
      className={cn(
        'nav-tab',
        'flex flex-col items-center justify-center',
        'flex-1 h-full',
        'relative',
        'transition-all duration-200 ease-out',
        isActive && 'nav-tab--active',
        tab.disabled && 'nav-tab--disabled'
      )}
      onClick={onPress}
      disabled={tab.disabled}
      role="tab"
      aria-selected={isActive}
      aria-label={`${tab.label} ${isActive ? 'active' : 'inactive'}`}
    >
      {/* Icon with badge */}
      <div className="nav-tab__icon-wrapper relative">
        <Icon
          name={isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
          size={24}
          color={isActive ? activeColor : inactiveColor}
          className="nav-tab__icon transition-colors duration-200"
        />
        
        {tab.badge && tab.badge > 0 && (
          <Badge
            count={tab.badge}
            className="nav-tab__badge absolute -top-1 -right-1"
            size="sm"
          />
        )}
      </div>

      {/* Label */}
      {showLabels && (
        <span
          className={cn(
            'nav-tab__label',
            'text-xs mt-1 font-medium transition-colors duration-200',
            isActive 
              ? 'nav-tab__label--active' 
              : 'nav-tab__label--inactive'
          )}
          style={{
            color: isActive ? activeColor : inactiveColor,
          }}
        >
          {tab.label}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <div
          className="nav-tab__indicator absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: activeColor,
            borderRadius: '50%',
            marginTop: '-2px',
          }}
        />
      )}
    </button>
  );
};
```

### 2. Badge Management
```typescript
// Dynamic badge updates
const useTabBadge = (tabId: NavigationTab) => {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    switch (tabId) {
      case 'home':
        setBadgeCount(getExpiredProductsCount());
        break;
      case 'recipes':
        setBadgeCount(getNewRecipesCount());
        break;
      case 'profile':
        setBadgeCount(getUnreadNotificationsCount());
        break;
      default:
        setBadgeCount(0);
    }
  }, [tabId]);

  return badgeCount;
};

// Update tabs with badges
useEffect(() => {
  const updatedTabs = navState.tabs.map(tab => ({
    ...tab,
    badge: useTabBadge(tab.id),
  }));
  
  setNavState(prev => ({ ...prev, tabs: updatedTabs }));
}, [notificationCount, products]);
```

### 3. Haptic Feedback
```typescript
// Haptic feedback hook
const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: 'selection' | 'impact' | 'notification') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'impact':
          navigator.vibrate(25);
          break;
        case 'notification':
          navigator.vibrate([50, 50, 50]);
          break;
      }
    }
  }, []);

  return { triggerHaptic };
};
```

## Styling
```css
/* Bottom navigation container */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  padding: 8px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Tab items */
.nav-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 8px;
  margin: 0 2px;
}

.nav-tab:hover:not(.nav-tab--disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-tab:active:not(.nav-tab--disabled) {
  transform: scale(0.95);
  background-color: rgba(0, 0, 0, 0.1);
}

.nav-tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Tab icons */
.nav-tab__icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.nav-tab__icon {
  transition: all 0.2s ease;
}

.nav-tab--active .nav-tab__icon {
  transform: scale(1.1);
}

/* Tab badges */
.nav-tab__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: var(--error-color);
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

/* Tab labels */
.nav-tab__label {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  transition: all 0.2s ease;
  margin-top: 2px;
}

.nav-tab__label--active {
  font-weight: 600;
}

.nav-tab__label--inactive {
  font-weight: 400;
  opacity: 0.7;
}

/* Active indicator */
.nav-tab__indicator {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

/* Responsive design */
@media (max-width: 320px) {
  .nav-tab__label {
    font-size: 10px;
  }
  
  .nav-tab {
    padding: 4px 4px;
  }
}

@media (min-width: 768px) {
  .bottom-navigation {
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }
}

/* Theme variations */
.bottom-navigation--dark {
  background-color: #1a1a1a;
  border-top-color: #333333;
}

.bottom-navigation--primary {
  background-color: var(--primary-color);
  border-top-color: var(--primary-color);
}

.bottom-navigation--primary .nav-tab__label--inactive {
  color: rgba(255, 255, 255, 0.7);
}

/* Animation states */
.nav-tab-enter {
  opacity: 0;
  transform: translateY(20px);
}

.nav-tab-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.nav-tab-exit {
  opacity: 1;
  transform: translateY(0);
}

.nav-tab-exit-active {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

/* Focus states */
.nav-tab:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 8px;
}

/* Keyboard navigation support */
.nav-tab[aria-selected="true"] {
  font-weight: 600;
}
```

## Accessibility Features
```typescript
// ARIA labels and roles
const AccessibleBottomNavigation: React.FC<BottomNavigationProps> = (props) => {
  return (
    <nav
      role="navigation"
      aria-label="Main application navigation"
      aria-orientation="horizontal"
    >
      <div role="tablist" aria-label="Application sections">
        {tabs.map((tab, index) => (
          <NavigationTabItem
            key={tab.id}
            tab={tab}
            tabIndex={index === 0 ? 0 : -1}
            aria-controls={`tabpanel-${tab.id}`}
            aria-describedby={`tab-desc-${tab.id}`}
          />
        ))}
      </div>
      
      {/* Hidden descriptions for screen readers */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          id={`tab-desc-${tab.id}`}
          className="sr-only"
        >
          Navigate to {tab.label} section
        </div>
      ))}
    </nav>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent, tabIndex: number) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      focusPreviousTab(tabIndex);
      break;
    case 'ArrowRight':
      event.preventDefault();
      focusNextTab(tabIndex);
      break;
    case 'Home':
      event.preventDefault();
      focusFirstTab();
      break;
    case 'End':
      event.preventDefault();
      focusLastTab();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      activateTab(tabIndex);
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize tab calculations
const tabsWithBadges = useMemo(() => {
  return navState.tabs.map(tab => ({
    ...tab,
    badge: getTabBadge(tab.id),
  }));
}, [navState.tabs, notificationCount, products]);

// Memoize active tab calculation
const currentActiveTab = useMemo(() => {
  return getCurrentTab();
}, [getCurrentTab]);

// Memoize event handlers
const handleTabPress = useCallback((tab: TabConfig) => {
  if (tab.disabled) return;
  
  triggerHaptic('selection');
  
  if (onTabChange) {
    onTabChange(tab.id);
  } else {
    navigate(tab.route);
  }
}, [navigate, onTabChange, triggerHaptic]);
```

### Virtualization
```typescript
// Optimize for frequent updates
const OptimizedBottomNavigation = React.memo(
  BottomNavigation,
  (prevProps, nextProps) => {
    return (
      prevProps.activeTab === nextProps.activeTab &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.activeColor === nextProps.activeColor &&
      prevProps.inactiveColor === nextProps.inactiveColor
    );
  }
);
```

## Testing Strategy
### Unit Tests
```typescript
describe('BottomNavigation Component', () => {
  test('renders all tabs correctly', () => {
    render(<BottomNavigation />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Add')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipes')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  test('highlights active tab correctly', () => {
    render(<BottomNavigation activeTab="home" />);
    
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab).toHaveAttribute('aria-selected', 'true');
    expect(homeTab).toHaveClass('nav-tab--active');
  });

  test('calls onTabChange when tab is pressed', () => {
    const mockOnTabChange = jest.fn();
    render(<BottomNavigation onTabChange={mockOnTabChange} />);
    
    fireEvent.click(screen.getByLabelText('Search'));
    expect(mockOnTabChange).toHaveBeenCalledWith('search');
  });

  test('navigates when no onTabChange provided', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(<BottomNavigation />);
    fireEvent.click(screen.getByLabelText('Recipes'));
    expect(mockNavigate).toHaveBeenCalledWith('/recipes');
  });

  test('displays badge count correctly', () => {
    render(<BottomNavigation />);
    
    // Mock badge count
    jest.mock('../hooks/useTabBadge', () => ({
      useTabBadge: () => 3,
    }));
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('BottomNavigation Integration', () => {
  test('syncs with route changes', () => {
    const { rerender } = render(
      <Router>
        <BottomNavigation />
      </Router>
    );
    
    // Check initial state
    expect(screen.getByLabelText('Home')).toHaveAttribute('aria-selected', 'true');
    
    // Simulate route change
    rerender(
      <Router location="/recipes">
        <BottomNavigation />
      </Router>
    );
    
    expect(screen.getByLabelText('Recipes')).toHaveAttribute('aria-selected', 'true');
  });

  test('keyboard navigation works', () => {
    render(<BottomNavigation />);
    
    const homeTab = screen.getByLabelText('Home');
    homeTab.focus();
    
    fireEvent.keyDown(homeTab, { key: 'ArrowRight' });
    
    expect(screen.getByLabelText('Search')).toHaveFocus();
    
    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'Enter' });
    
    expect(screen.getByLabelText('Search')).toHaveAttribute('aria-selected', 'true');
  });
});
```

## Error Handling
```typescript
// Error boundary for bottom navigation
const BottomNavigationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <nav className="bottom-navigation bottom-navigation--error">
          <button className="nav-tab" onClick={() => window.location.reload()}>
            <Icon name="home" />
            <span>Home</span>
          </button>
        </nav>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Fallback rendering
const SafeBottomNavigation: React.FC<BottomNavigationProps> = (props) => {
  try {
    return <BottomNavigation {...props} />;
  } catch (error) {
    console.error('BottomNavigation error:', error);
    return (
      <nav className="bottom-navigation">
        <button onClick={() => window.location.href = '/'}>
          <Icon name="home" />
          <span>Home</span>
        </button>
      </nav>
    );
  }
};
```

## Animation & Transitions
```typescript
// Smooth tab transitions
const AnimatedBottomNavigation: React.FC<BottomNavigationProps> = (props) => {
  return (
    <motion.nav
      className="bottom-navigation"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <AnimatePresence mode="wait">
        {props.tabs.map((tab) => (
          <motion.div
            key={tab.id}
            className="nav-tab"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            {/* Tab content */}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.nav>
  );
};
```

## Documentation Links
- [App Component](./App.md)
- [Layout Component](./Layout.md)
- [Icon Component](../common/Icon.md)
- [Badge Component](../common/Badge.md)
- [Navigation Guide](../overview/NavigationGuide.md)
