# System Patterns: The Next Side - Pantry Management App

## System Architecture

### High-Level Architecture (Phase 1 - Current)
```
┌─────────────────────────────────────────────────┐
│              User Interface Layer               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Screens  │  │  Components │  │  Hooks   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            State Management Layer               │
│              (Zustand - Future)                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              Data Persistence Layer             │
│              (LocalStorage - Future)            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Storage/Database Layer                │
│              (Firebase - Phase 4)               │
└─────────────────────────────────────────────────┘
```

### Component Architecture

#### Component Hierarchy
```
App (Root)
└── App Container
    ├── Routes
    │   ├── HomeScreen
    │   │   ├── Header (Future)
    │   │   ├── SearchBar (Future)
    │   │   ├── FilterTabs (Future)
    │   │   └── ProductList (Future)
    │   ├── SearchScreen
    │   ├── AddProductScreen
    │   ├── RecipesScreen
    │   └── ProfileScreen
    └── BottomNavigation
```

#### Component Categories

**1. Layout Components**
- **App**: Root component with routing
- **Container**: Responsive container wrapper
- **Header**: Page headers (future)
- **BottomNavigation**: Main navigation bar

**2. Screen Components**
- **HomeScreen**: Pantry list display
- **SearchScreen**: Advanced search functionality
- **AddProductScreen**: Product form
- **RecipesScreen**: Recipe browser
- **ProfileScreen**: User settings

**3. Feature Components** (Future)
- **ProductCard**: Individual product display
- **ProductList**: List of products
- **SearchBar**: Search input component
- **FilterTabs**: Category filter tabs
- **RecipeCard**: Recipe preview
- **ShoppingListItem**: Shopping list item

**4. Common Components** (Future)
- **Button**: Standardized button
- **Input**: Form inputs
- **Modal**: Dialog/Modal overlays
- **Badge**: Status indicators
- **Avatar**: User profile images

### Routing Architecture

#### Route Structure (React Router v7)
```typescript
Routes:
├── / → HomeScreen (Pantry List)
├── /search → SearchScreen
├── /add-product → AddProductScreen
├── /recipes → RecipesScreen
├── /profile → ProfileScreen
└── /product/:id → ProductDetailScreen (Future)
```

#### Navigation Patterns
- **Main Navigation**: Bottom navigation bar (fixed position)
- **Deep Navigation**: Stack-based navigation for nested screens
- **Tab Switching**: Quick access between main sections
- **Back Navigation**: Browser back button and programmatic navigation

## State Management Strategy

### Current State (Phase 1)
- Component-level state using React hooks
- No global state management yet
- Static content with placeholder data

### Planned State Management (Phase 2+)
- **Zustand** for global state
- **State slices**:
  - `productsSlice`: Product data management
  - `uiSlice`: UI state (modals, filters, etc.)
  - `userSlice`: User preferences and settings
  - `shoppingListSlice`: Shopping list management

### State Structure (Future)
```typescript
interface AppState {
  products: {
    items: Product[];
    filters: ProductFilters;
    loading: boolean;
    error: string | null;
  };
  ui: {
    activeTab: string;
    searchQuery: string;
    selectedProduct: string | null;
  };
  user: {
    preferences: UserPreferences;
    notifications: NotificationSettings;
  };
}
```

## Design Patterns

### 1. Component Composition Pattern
**Purpose**: Build complex UIs from simple, reusable components

**Example**:
```typescript
<ProductCard>
  <ProductImage />
  <ProductInfo />
  <ProductActions />
</ProductCard>
```

### 2. Container/Presenter Pattern (Future)
**Purpose**: Separate logic from presentation

**Example**:
```typescript
// Container
const ProductListContainer = () => {
  const products = useProductStore(state => state.products);
  return <ProductList products={products} />;
};

// Presenter
interface ProductListProps {
  products: Product[];
}
const ProductList = ({ products }: ProductListProps) => {
  // Presentation logic only
};
```

### 3. Custom Hook Pattern
**Purpose**: Reusable stateful logic

**Current Hooks**:
- `useBreakpoint`: Responsive breakpoint detection
- `useResizeObserver`: Element resize tracking
- `useScrollPosition`: Scroll position tracking

**Future Hooks**:
- `useProducts`: Product data management
- `useSearch`: Search functionality
- `useNavigation`: Navigation helpers
- `useLocalStorage`: Local storage persistence

### 4. Render Props Pattern (Consideration)
**Purpose**: Share code between components via render function

### 5. Higher-Order Component (HOC) Pattern (Consideration)
**Purpose**: Component enhancement for cross-cutting concerns

## Data Flow Patterns

### Unidirectional Data Flow
```
User Action
    ↓
Event Handler
    ↓
State Update
    ↓
Re-render
    ↓
UI Update
```

### Data Fetching Pattern (Future)
```typescript
const { data, loading, error, refetch } = useProducts();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
return <ProductList products={data} />;
```

### Form Handling Pattern (Future)
```typescript
const { values, handleChange, handleSubmit, errors } = useForm({
  initialValues: initialProduct,
  validation: productValidationSchema,
  onSubmit: handleProductSubmit
});
```

## Key Technical Decisions

### 1. Mobile-First Approach
**Rationale**: Target use case is mobile users
**Implementation**:
- Responsive breakpoints
- Touch-friendly interactions
- Mobile-optimized layouts
- Bottom navigation pattern

### 2. Component Library Choice (antd-mobile)
**Rationale**: 
- Mobile-optimized components
- Well-maintained and documented
- TypeScript support
- Consistent design system

**Alternative Considered**: Material UI, Chakra UI

### 3. State Management Choice (Zustand)
**Rationale** (Future):
- Lightweight and simple
- No boilerplate
- TypeScript support
- Performance optimized
- Easy to learn

**Alternative Considered**: Redux Toolkit, Context API

### 4. Styling Choice (Tailwind CSS 4.x)
**Rationale**:
- Utility-first approach
- Fast development
- Consistent design
- Small bundle size
- Customization flexibility

### 5. React Compiler
**Rationale**:
- Automatic memoization
- Performance optimization
- Reduced manual optimization
- Future-forward technology

## Component Relationships

### Core Components Dependencies
```
App
├── Routes
│   ├── Screens
│   │   └── Components (feature-specific)
│   └── Components (shared)
├── BottomNavigation
├── Hooks
└── Utils
```

### Component Communication
- **Parent → Child**: Props
- **Child → Parent**: Callback functions
- **Sibling**: Shared parent state or global store
- **Deep nesting**: Context API or Zustand

## Performance Patterns

### 1. Code Splitting (Future)
```typescript
const ProductDetailScreen = lazy(() => 
  import('./screens/ProductDetailScreen')
);
```

### 2. Virtual Scrolling (Future)
For large product lists to improve rendering performance

### 3. Image Optimization (Future)
- Lazy loading
- Responsive images
- WebP format
- CDN delivery

### 4. Memoization
- React Compiler handles automatic memoization
- Manual useMemo/useCallback when needed

## Testing Patterns

### 1. Component Testing (Vitest + React Testing Library)
```typescript
describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
  });
});
```

### 2. Storybook Testing
- Visual regression testing
- Component isolation
- Design system documentation

### 3. E2E Testing (Playwright)
```typescript
test('user can add product', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-product"]');
  // ... test flow
});
```

## Critical Implementation Paths

### 1. Adding a Product (Phase 2)
```
User clicks "Add"
  ↓
Navigate to AddProductScreen
  ↓
Fill form
  ↓
Validate input
  ↓
Save to store
  ↓
Update UI
  ↓
Navigate back
```

### 2. Filtering Products (Phase 2)
```
User selects filter tab
  ↓
Update filter state
  ↓
Filter products array
  ↓
Re-render filtered list
```

### 3. Product Expiration Tracking (Phase 2)
```
Check expiration dates
  ↓
Calculate days remaining
  ↓
Apply visual indicators
  ↓
Sort by urgency (optional)
```

## Security Considerations

### 1. Input Validation
- Sanitize all user inputs
- Validate on client and server
- Prevent XSS attacks

### 2. Data Storage (Phase 4)
- Encrypt sensitive data
- Secure authentication
- API rate limiting

### 3. API Communication (Phase 4)
- HTTPS only
- CORS configuration
- Token-based authentication

## Scalability Considerations

### 1. Component Reusability
- Design components for multiple use cases
- Props over hardcoded values
- Composition over inheritance

### 2. State Management
- Normalize data structure
- Selective subscriptions
- Lazy loading

### 3. Performance
- Code splitting
- Asset optimization
- Caching strategies