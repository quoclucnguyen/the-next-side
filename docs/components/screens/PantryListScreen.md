# PantryListScreen Component

## Overview
Màn hình chính của ứng dụng, hiển thị danh sách tất cả các mặt hàng trong tủ bếp. Bao gồm thanh tìm kiếm, bộ lọc theo loại, và danh sách sản phẩm với thông tin cơ bản và cảnh báo hết hạn.

## Props Interface
```typescript
interface PantryListScreenProps {
  products?: Product[];
  loading?: boolean;
  error?: string | null;
  onProductPress?: (product: Product) => void;
  onAddProduct?: () => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: FilterState) => void;
  className?: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: ProductCategory;
  expirationDate: string;
  addedDate: string;
  brand?: string;
  imageUrl?: string;
  notes?: string;
}

interface FilterState {
  searchQuery: string;
  category: 'ALL' | 'FRIDGE' | 'FREEZER' | 'DRY_PANTRY';
  sortBy: 'name' | 'expiration' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}

type ProductCategory = 'FRIDGE' | 'FREEZER' | 'DRY_PANTRY' | 'OTHER';
```

## State Management
```typescript
// Local state
const [screenState, setScreenState] = useState({
  searchQuery: '',
  activeFilter: 'ALL' as FilterState['category'],
  sortBy: 'dateAdded' as FilterState['sortBy'],
  sortOrder: 'desc' as FilterState['sortOrder'],
  isRefreshing: false,
});

// Global state interaction
const { 
  products: globalProducts, 
  loading: globalLoading, 
  error: globalError,
  filters 
} = useSelector((state: RootState) => state.pantry);
const dispatch = useDispatch();

const products = products || globalProducts;
const loading = loading !== undefined ? loading : globalLoading;
const error = error !== undefined ? error : globalError;
```

## Dependencies
```typescript
// External dependencies
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal dependencies
import { Container } from '../core/Container';
import { SearchBar } from '../pantry-features/SearchBar';
import { FilterTabs } from '../pantry-features/FilterTabs';
import { ProductList } from '../pantry-features/ProductList';
import { ProductCard } from '../pantry-features/ProductCard';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { cn } from '../utils/cn';
import { useDebounce } from '../hooks/useDebounce';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
```

## Usage Example
```typescript
const PantryListScreen: React.FC<PantryListScreenProps> = ({
  products: propProducts,
  loading: propLoading,
  error: propError,
  onProductPress,
  onAddProduct,
  onSearch,
  onFilterChange,
  className
}) => {
  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(screenState.searchQuery, 300);

  // Global state integration
  const dispatch = useDispatch();
  const { products: globalProducts, loading: globalLoading } = useSelector((state: RootState) => state.pantry);

  const products = propProducts || globalProducts;
  const loading = propLoading !== undefined ? propLoading : globalLoading;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products || [];

    // Apply search filter
    if (debouncedSearchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (screenState.activeFilter !== 'ALL') {
      filtered = filtered.filter(product => product.category === screenState.activeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (screenState.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'expiration':
          comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
          break;
        case 'dateAdded':
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
      }

      return screenState.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [products, debouncedSearchQuery, screenState.activeFilter, screenState.sortBy, screenState.sortOrder]);

  // Event handlers
  const handleSearch = useCallback((query: string) => {
    setScreenState(prev => ({ ...prev, searchQuery: query }));
    onSearch?.(query);
  }, [onSearch]);

  const handleFilterChange = useCallback((category: FilterState['category']) => {
    setScreenState(prev => ({ ...prev, activeFilter: category }));
    onFilterChange?.({ ...screenState, category });
  }, [onFilterChange, screenState]);

  const handleSortChange = useCallback((sortBy: FilterState['sortBy']) => {
    setScreenState(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    onProductPress?.(product);
    navigate(`/product/${product.id}`);
  }, [navigate, onProductPress]);

  const handleAddProduct = useCallback(() => {
    onAddProduct?.();
    navigate('/add-product');
  }, [navigate, onAddProduct]);

  const handleRefresh = useCallback(async () => {
    setScreenState(prev => ({ ...prev, isRefreshing: true }));
    try {
      await dispatch(fetchProducts());
    } finally {
      setScreenState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [dispatch]);

  // Pull to refresh
  const { pullDistance, isPulling } = usePullToRefresh(handleRefresh);

  return (
    <Container variant="default" className="pantry-list-screen">
      {/* Header */}
      <div className="pantry-list-screen__header">
        <SearchBar
          value={screenState.searchQuery}
          onChange={handleSearch}
          placeholder="Search your pantry"
          className="pantry-list-screen__search"
        />
        
        <FilterTabs
          activeTab={screenState.activeFilter}
          onTabChange={handleFilterChange}
          className="pantry-list-screen__filters"
        />
      </div>

      {/* Sort options */}
      <div className="pantry-list-screen__sort">
        <SortOptions
          sortBy={screenState.sortBy}
          sortOrder={screenState.sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Content */}
      <div className="pantry-list-screen__content">
        {loading && !screenState.isRefreshing ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={handleRefresh}
          />
        ) : filteredAndSortedProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description={
              screenState.searchQuery || screenState.activeFilter !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first product'
            }
            action={
              !screenState.searchQuery && screenState.activeFilter === 'ALL' ? (
                <Button onPress={handleAddProduct}>
                  Add Your First Product
                </Button>
              ) : null
            }
          />
        ) : (
          <ProductList
            products={filteredAndSortedProducts}
            onProductPress={handleProductPress}
            pullDistance={pullDistance}
            isPulling={isPulling}
          />
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleAddProduct}
        icon="add"
        className="pantry-list-screen__fab"
        aria-label="Add new product"
      />
    </Container>
  );
};
```

## Features
### 1. Product Filtering
```typescript
// Advanced filtering logic
const useProductFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'ALL',
    sortBy: 'dateAdded',
    sortOrder: 'desc',
  });

  const applyFilters = useCallback((products: Product[], filters: FilterState) => {
    return products
      .filter(product => {
        // Search filter
        if (filters.searchQuery) {
          const searchLower = filters.searchQuery.toLowerCase();
          const matchesSearch = 
            product.name.toLowerCase().includes(searchLower) ||
            product.brand?.toLowerCase().includes(searchLower) ||
            product.notes?.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        // Category filter
        if (filters.category !== 'ALL' && product.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'expiration':
            comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
            break;
          case 'dateAdded':
            comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
            break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
  }, []);

  return { filters, setFilters, applyFilters };
};
```

### 2. Search Functionality
```typescript
// Enhanced search with suggestions
const useSearchSuggestions = (products: Product[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const matches = new Set<string>();

    products.forEach(product => {
      // Name matches
      if (product.name.toLowerCase().includes(queryLower)) {
        matches.add(product.name);
      }

      // Brand matches
      if (product.brand?.toLowerCase().includes(queryLower)) {
        matches.add(product.brand);
      }

      // Category matches
      if (product.category.toLowerCase().includes(queryLower)) {
        matches.add(product.category);
      }
    });

    setSuggestions(Array.from(matches).slice(0, 5));
  }, [products]);

  return { suggestions, getSuggestions };
};
```

### 3. Pull to Refresh
```typescript
// Pull to refresh implementation
const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isPulling && window.scrollY === 0) {
      const touch = e.touches[0];
      setPullDistance(Math.min(touch.clientY, 120));
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > 80) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pullDistance, isPulling, isRefreshing };
};
```

## Styling
```css
/* Screen container */
.pantry-list-screen {
  min-height: 100vh;
  padding-bottom: 80px; /* Space for FAB */
  position: relative;
}

/* Header section */
.pantry-list-screen__header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--background-color);
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
}

.pantry-list-screen__search {
  margin-bottom: 16px;
}

.pantry-list-screen__filters {
  margin-bottom: 8px;
}

/* Sort section */
.pantry-list-screen__sort {
  padding: 12px 16px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

/* Content area */
.pantry-list-screen__content {
  flex: 1;
  padding: 16px 0;
  position: relative;
}

/* Floating Action Button */
.pantry-list-screen__fab {
  position: fixed;
  bottom: 80px; /* Above bottom nav */
  right: 16px;
  z-index: 100;
}

/* Pull to refresh indicator */
.pantry-list-screen__pull-indicator {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: var(--primary-color);
  color: white;
  opacity: 0;
  transition: all 0.3s ease;
}

.pantry-list-screen__pull-indicator--visible {
  opacity: 1;
  top: 20px;
}

/* Empty state styling */
.pantry-list-screen__empty {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.pantry-list-screen__empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.pantry-list-screen__empty-description {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
}

/* Loading state */
.pantry-list-screen__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

/* Error state */
.pantry-list-screen__error {
  text-align: center;
  padding: 48px 24px;
}

.pantry-list-screen__error-message {
  color: var(--error-color);
  font-size: 16px;
  margin-bottom: 16px;
}

/* Responsive design */
@media (max-width: 768px) {
  .pantry-list-screen {
    padding-bottom: 72px;
  }
  
  .pantry-list-screen__header {
    padding: 12px;
  }
  
  .pantry-list-screen__fab {
    bottom: 72px;
    right: 12px;
  }
}

@media (min-width: 769px) {
  .pantry-list-screen {
    max-width: 768px;
    margin: 0 auto;
  }
  
  .pantry-list-screen__fab {
    bottom: 24px;
  }
}

/* Animation states */
.pantry-list-screen--loading {
  pointer-events: none;
  opacity: 0.7;
}

.pantry-list-screen__content {
  transition: opacity 0.3s ease;
}

.pantry-list-screen__content--loading {
  opacity: 0.5;
}

/* Focus states */
.pantry-list-screen:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

## Accessibility Features
```typescript
// Screen reader support
const AccessiblePantryListScreen: React.FC<PantryListScreenProps> = (props) => {
  const announceFilterChange = useCallback((filter: string) => {
    const announcement = `Filter changed to ${filter}. ${filteredProducts.length} products found.`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, [filteredProducts.length]);

  const announceSortChange = useCallback((sortBy: string, sortOrder: string) => {
    const announcement = `Sorted by ${sortBy} in ${sortOrder} order.`;
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  return (
    <div role="main" aria-label="Pantry product list">
      {/* Hidden live region for announcements */}
      <div
        id="screen-reader-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      <PantryListScreen
        {...props}
        onFilterChange={(filter) => {
          props.onFilterChange?.(filter);
          announceFilterChange(filter.category);
        }}
        onSortChange={(sortBy) => {
          props.onSortChange?.(sortBy);
          announceSortChange(sortBy, screenState.sortOrder);
        }}
      />
    </div>
  );
};

// Keyboard navigation
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  const focusedElement = document.activeElement;
  
  if (!focusedElement?.closest('.pantry-list-screen')) return;

  switch (event.key) {
    case '/':
      event.preventDefault();
      searchInputRef.current?.focus();
      break;
    case 'n':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        handleAddProduct();
      }
      break;
    case 'Escape':
      if (searchInputRef.current === focusedElement) {
        event.preventDefault();
        searchInputRef.current?.blur();
      }
      break;
  }
}, []);
```

## Performance Optimizations
### Memoization
```typescript
// Memoize expensive calculations
const filteredAndSortedProducts = useMemo(() => {
  const result = applyFilters(products || [], screenState);
  
  // Add computed properties
  return result.map(product => ({
    ...product,
    isExpiringSoon: isProductExpiringSoon(product),
    daysUntilExpiration: getDaysUntilExpiration(product),
    isExpired: isProductExpired(product),
  }));
}, [products, screenState, applyFilters]);

// Memoize event handlers
const handleSearch = useCallback((query: string) => {
  setScreenState(prev => ({ ...prev, searchQuery: query }));
  onSearch?.(query);
}, [onSearch]);

// Memoize product list rendering
const ProductListMemo = React.memo(ProductList, (prevProps, nextProps) => {
  return (
    prevProps.products.length === nextProps.products.length &&
    prevProps.products.every((product, index) => 
      product.id === nextProps.products[index]?.id
    ) &&
    prevProps.pullDistance === nextProps.pullDistance &&
    prevProps.isPulling === nextProps.isPulling
  );
});
```

### Virtual Scrolling
```typescript
// Virtual list for large datasets
const VirtualizedProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  useEffect(() => {
    setShouldVirtualize(products.length > 100);
  }, [products.length]);

  if (shouldVirtualize) {
    return (
      <FixedSizeList
        height={window.innerHeight - 200}
        itemCount={products.length}
        itemSize={120}
        itemData={products}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <ProductCard
              product={data[index]}
              onPress={handleProductPress}
            />
          </div>
        )}
      </FixedSizeList>
    );
  }

  return (
    <ProductList products={products} onProductPress={handleProductPress} />
  );
};
```

## Testing Strategy
### Unit Tests
```typescript
describe('PantryListScreen Component', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Tomatoes',
      quantity: 3,
      unit: 'pc',
      category: 'FRIDGE',
      expirationDate: '2024-12-20',
      addedDate: '2024-12-18',
    },
    {
      id: '2',
      name: 'Milk',
      quantity: 1,
      unit: 'gallon',
      category: 'FRIDGE',
      expirationDate: '2024-12-25',
      addedDate: '2024-12-17',
    },
  ];

  test('renders product list correctly', () => {
    render(<PantryListScreen products={mockProducts} />);
    
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  test('filters products by search query', async () => {
    render(<PantryListScreen products={mockProducts} />);
    
    const searchInput = screen.getByPlaceholderText('Search your pantry');
    fireEvent.change(searchInput, { target: { value: 'Tomatoes' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tomatoes')).toBeInTheDocument();
      expect(screen.queryByText('Milk')).not.toBeInTheDocument();
    });
  });

  test('filters products by category', () => {
    render(<PantryListScreen products={mockProducts} />);
    
    const freezerTab = screen.getByText('FREEZER');
    fireEvent.click(freezerTab);
    
    expect(screen.queryByText('Tomatoes')).not.toBeInTheDocument();
    expect(screen.queryByText('Milk')).not.toBeInTheDocument();
  });

  test('sorts products correctly', () => {
    render(<PantryListScreen products={mockProducts} />);
    
    const sortButton = screen.getByText('Sort by Date Added');
    fireEvent.click(sortButton);
    
    // Check if products are sorted
    const productElements = screen.getAllByTestId('product-card');
    expect(productElements[0]).toHaveTextContent('Tomatoes'); // Most recent
  });

  test('shows empty state when no products', () => {
    render(<PantryListScreen products={[]} />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('Start by adding your first product')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<PantryListScreen loading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<PantryListScreen error="Failed to load products" />);
    
    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('PantryListScreen Integration', () => {
  test('navigates to product detail on product press', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(<PantryListScreen products={mockProducts} />);
    
    fireEvent.click(screen.getByText('Tomatoes'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  test('navigates to add product on FAB press', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
    }));
    
    render(<PantryListScreen products={mockProducts} />);
    
    const fab = screen.getByLabelText('Add new product');
    fireEvent.click(fab);
    expect(mockNavigate).toHaveBeenCalledWith('/add-product');
  });
});
```

## Error Handling
```typescript
// Error boundary for screen
const PantryListScreenErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <Container>
          <div className="pantry-list-screen__error">
            <h2>Something went wrong</h2>
            <p>Unable to load your pantry items. Please try again.</p>
            <Button onPress={() => window.location.reload()}>
              Reload App
            </Button>
          </div>
        </Container>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Retry mechanism
const useRetryLogic = (error: string | null, retry: () => void) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    if (retryCount >= 3) {
      // Show error message suggesting app restart
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await retry();
    } finally {
      setIsRetrying(false);
    }
  }, [retry, retryCount]);

  return { handleRetry, retryCount, isRetrying };
};
```

## Documentation Links
- [App Component](../core/App.md)
- [Layout Component](../core/Layout.md)
- [SearchBar Component](../pantry-features/SearchBar.md)
- [FilterTabs Component](../pantry-features/FilterTabs.md)
- [ProductList Component](../pantry-features/ProductList.md)
- [ProductCard Component](../pantry-features/ProductCard.md)
