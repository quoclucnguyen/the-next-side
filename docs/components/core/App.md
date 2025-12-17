# App Component

## Overview
Component gốc của ứng dụng Pantry Management, chịu trách nhiệm khởi tạo ứng dụng, quản lý routing, global state và các providers cần thiết.

## Props Interface
```typescript
interface AppProps {
  children?: React.ReactNode;
}
```

## State Management
```typescript
// Global state structure
interface AppState {
  user: User | null;
  products: Product[];
  filters: FilterState;
  loading: LoadingState;
  error: ErrorState;
}

interface FilterState {
  searchQuery: string;
  category: 'ALL' | 'FRIDGE' | 'FREEZER' | 'DRY_PANTRY';
  sortBy: 'name' | 'expiration' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}

interface LoadingState {
  products: boolean;
  productDetail: boolean;
  addProduct: boolean;
  recipes: boolean;
}
```

## Dependencies
```typescript
// External dependencies
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Internal dependencies
import { store } from '../store';
import { theme } from '../theme';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { LoadingProvider } from '../providers/LoadingProvider';
import { NotificationProvider } from '../providers/NotificationProvider';
```

## Usage Example
```typescript
const App: React.FC<AppProps> = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <LoadingProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<PantryListScreen />} />
                    <Route path="/product/:id" element={<ProductDetailScreen />} />
                    <Route path="/add-product" element={<AddProductScreen />} />
                    <Route path="/search" element={<SearchScreen />} />
                    <Route path="/recipes" element={<RecipesScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </NotificationProvider>
          </LoadingProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};
```

## Features
### 1. State Management Integration
- Redux store cho global state
- Local state cho component-specific data
- State persistence với localStorage

### 2. Error Handling
- Global error boundary
- Error logging và reporting
- User-friendly error messages

### 3. Performance Optimizations
- Code splitting với React.lazy
- Memoization cho expensive computations
- Virtual scrolling cho large lists

### 4. Accessibility
- Screen reader support
- Keyboard navigation
- ARIA labels và landmarks

## Styling
```css
/* Global styles */
:root {
  --primary-color: #FF6B35;
  --background-color: #FFFFFF;
  --text-color: #333333;
  --border-color: #E0E0E0;
  --success-color: #4CAF50;
  --warning-color: #FFC107;
  --error-color: #F44336;
}

.app {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.app--loading {
  pointer-events: none;
  opacity: 0.7;
}
```

## Testing Strategy
### Unit Tests
```typescript
describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('provides Redux store', () => {
    render(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });

  test('handles routing correctly', () => {
    render(<App />);
    // Test navigation between routes
  });
});
```

### Integration Tests
```typescript
describe('App Integration', () => {
  test('full user flow works', async () => {
    // Test complete user journey
  });

  test('error boundary catches errors', () => {
    // Test error handling
  });
});
```

## Performance Considerations
### Bundle Size Optimization
```typescript
// Code splitting
const PantryListScreen = lazy(() => import('../screens/PantryListScreen'));
const ProductDetailScreen = lazy(() => import('../screens/ProductDetailScreen'));
const AddProductScreen = lazy(() => import('../screens/AddProductScreen'));
```

### Memory Management
```typescript
// Cleanup effects
useEffect(() => {
  // Setup
  return () => {
    // Cleanup
  };
}, []);
```

## Security Considerations
### Data Validation
```typescript
// Input validation
const validateProductData = (data: unknown): data is Product => {
  // Validation logic
  return true;
};
```

### Route Protection
```typescript
// Protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <>{children}</> : <Navigate to="/login" />;
};
```

## Environment Configuration
```typescript
// Environment variables
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  FIREBASE_CONFIG: process.env.REACT_APP_FIREBASE_CONFIG,
  ENVIRONMENT: process.env.NODE_ENV,
};
```

## Monitoring & Analytics
```typescript
// Analytics integration
useEffect(() => {
  analytics.track('app_loaded');
  analytics.identify(user?.id);
}, [user]);

// Error tracking
const handleError = (error: Error) => {
  analytics.track('error_occurred', { message: error.message });
  crashlytics.recordError(error);
};
```

## Debug Tools
```typescript
// Development tools
if (process.env.NODE_ENV === 'development') {
  // Redux DevTools
  // React DevTools
  // Performance monitoring
}
```

## Deployment Considerations
### Build Optimization
```typescript
// Build configuration
const buildConfig = {
  optimization: true,
  sourceMap: false,
  minification: true,
  bundleAnalysis: true,
};
```

### CDN Integration
```typescript
// Asset optimization
const assetConfig = {
  imageOptimization: true,
  lazyLoading: true,
  compression: 'gzip',
};
```

## Maintenance & Updates
### Version Management
```typescript
// App version
const APP_VERSION = '1.0.0';

// Update checking
useEffect(() => {
  checkForUpdates();
}, []);
```

### Feature Flags
```typescript
// Feature toggle system
const features = {
  newRecipeFeature: isEnabled('new_recipe_feature'),
  advancedSearch: isEnabled('advanced_search'),
};
```

## Documentation Links
- [Component Architecture](../overview/ComponentArchitecture.md)
- [State Management](../overview/StateManagement.md)
- [Implementation Guide](../overview/ImplementationGuide.md)
