# Active Context: The Next Side - Pantry Management App

## Current Work Focus

### Phase 1: MVP Core Features (Current - In Progress)

**Timeline**: Q1 2026  
**Status**: Early Development  
**Progress**: ~20% Complete

### What We're Building Now

#### 1. Core Navigation Structure ✅ COMPLETED
- **File**: `src/App.tsx`
- **Implementation**: React Router v7 setup with 5 main routes
- **Routes Implemented**:
  - `/` → HomeScreen (Pantry List placeholder)
  - `/search` → SearchScreen (placeholder)
  - `/add-product` → AddProductScreen (placeholder)
  - `/recipes` → RecipesScreen (placeholder)
  - `/profile` → ProfileScreen (placeholder)

#### 2. Bottom Navigation Component ✅ COMPLETED
- **File**: `src/components/BottomNavigation/`
- **Implementation**: Fixed position navigation bar with 5 tabs
- **Features**:
  - Active tab highlighting
  - React Router integration
  - Icon-based navigation using antd-mobile-icons
  - Responsive design (mobile-first)

#### 3. Container Component ✅ COMPLETED
- **File**: `src/components/Container/`
- **Implementation**: Responsive container wrapper
- **Features**:
  - Max-width constraints
  - Horizontal padding
  - Centering logic
  - Mobile responsiveness
- **Has Storybook stories**

#### 4. Header Component ✅ COMPLETED
- **File**: `src/components/Header/`
- **Implementation**: Reusable page header
- **Features**:
  - Title display
  - Optional back button
  - Action button support
  - Custom styling
- **Has Storybook stories**

#### 5. Custom Hooks ✅ COMPLETED
- **Files**: `src/hooks/`
- **Implemented**:
  - `useBreakpoint.ts`: Responsive breakpoint detection
  - `useResizeObserver.ts`: Element size tracking
  - `useScrollPosition.ts`: Scroll position tracking
- **Purpose**: Reusable logic for responsive design

#### 6. Screen Placeholders ✅ COMPLETED
- **Files**: `src/screens/`
- **Implemented**:
  - `HomeScreen.tsx`
  - `SearchScreen.tsx`
  - `AddProductScreen.tsx`
  - `RecipesScreen.tsx`
  - `ProfileScreen.tsx`
- **Current State**: Basic placeholders with heading and description

### What Needs to Be Built Next

#### Immediate Next Steps (Priority Order)

1. **Design System Documentation** 📋
   - Complete design system in docs/
   - Define color palette, typography, spacing
   - Create component usage guidelines

2. **Product Data Models** 🔄
   - Define TypeScript interfaces for Product
   - Create mock data for development
   - Set up data structure for local storage

3. **Product Card Component** 📦
   - Visual representation of a product
   - Display name, quantity, expiration
   - Show expiration status (expired, expiring soon, OK)
   - Navigation to product detail

4. **Product List Component** 📋
   - List of ProductCard components
   - Filtering by category (All, Fridge, Freezer, Dry Pantry)
   - Search functionality
   - Empty state handling

5. **Home Screen Implementation** 🏠
   - Integrate ProductList
   - Add search bar
   - Add filter tabs
   - Add "Add Product" floating action button

6. **Add Product Screen** ➕
   - Form for adding new products
   - Fields: name, category, quantity, unit, expiration date, brand
   - Form validation
   - Save to local storage

7. **Product Detail Screen** 📄
   - Full product information
   - Edit/delete actions
   - Purchase history display
   - Recipe suggestions (placeholder)

8. **State Management Setup** ⚙️
   - Initialize Zustand store
   - Create product store slice
   - Create UI store slice
   - Add localStorage persistence

## Recent Changes

### Last Session Changes
1. **Created Memory Bank**: Initial setup of project documentation
2. **Completed Phase 1 Setup**:
   - Navigation structure with React Router
   - Bottom navigation component
   - Basic screen placeholders
   - Reusable components (Container, Header)
   - Custom hooks for responsiveness

### Code Quality
- **React Compiler**: Enabled for automatic optimization
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React rules
- **Storybook**: Set up for component development

## Active Decisions and Considerations

### Confirmed Decisions

#### 1. Mobile-First Design
**Decision**: Prioritize mobile experience over desktop
**Rationale**: Primary use case is mobile users managing their pantry on-the-go
**Implementation**: 
- Bottom navigation bar
- Touch-friendly interactions
- Responsive breakpoints starting from mobile

#### 2. Component Library: Ant Design Mobile
**Decision**: Use antd-mobile for UI components
**Rationale**: 
- Mobile-optimized components out-of-the-box
- Good TypeScript support
- Active maintenance
- Consistent design system

#### 3. State Management: Zustand
**Decision**: Use Zustand for global state management (Phase 2)
**Rationale**:
- Lightweight and simple
- No boilerplate code
- Better performance than Context API
- Easy to learn and use

#### 4. Styling: Tailwind CSS 4.x
**Decision**: Use Tailwind CSS for styling
**Rationale**:
- Utility-first approach for rapid development
- Consistent design system
- Small bundle size
- Custom theme support

#### 5. React Compiler
**Decision**: Enable React Compiler for automatic optimization
**Rationale**:
- Reduces need for manual memoization
- Performance optimization
- Future-forward technology
- Stable for production use

### Pending Decisions

#### 1. Data Persistence Strategy
**Options**:
- **LocalStorage**: Simple, but limited storage (5-10MB)
- **IndexedDB**: More complex, but larger storage (hundreds of MB)
- **Hybrid**: LocalStorage for settings, IndexedDB for products

**Recommendation**: Start with LocalStorage for Phase 2, migrate to IndexedDB in Phase 3 if needed

#### 2. Form Validation Library
**Options**:
- **React Hook Form**: Lightweight, performant
- **Formik**: Feature-rich, popular
- **Custom Implementation**: Full control, but more work

**Recommendation**: React Hook Form for simplicity and performance

#### 3. Image Handling
**Options**:
- **Base64**: Simple, but increases payload size
- **File System API**: More complex, better for large images
- **Cloud Storage**: Best for production, but requires backend

**Recommendation**: Start with Base64 for MVP, move to cloud storage in Phase 4

#### 4. Barcode Scanning
**Options**:
- **QuaggaJS**: Open-source, JavaScript-based
- **html5-qrcode**: Popular, well-maintained
- **Native Camera APIs**: More complex, but better control

**Recommendation**: html5-qrcode for ease of use and maintenance

## Important Patterns and Preferences

### Coding Style

#### TypeScript Preferences
- Use `interface` for object shapes
- Use `type` for unions, intersections, and primitives
- Use `React.FC` for functional components
- Prefer explicit types over inference for component props
- Use optional chaining (`?.`) and nullish coalescing (`??`)

#### React Patterns
- Functional components only (no class components)
- Hooks for all state and side effects
- Custom hooks for reusable logic
- Conditional rendering with ternary operators
- Early returns for edge cases

#### Component Structure
```typescript
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
  onAction: () => void;
}

// 3. Component
const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  // Hooks
  const [state, setState] = useState(null);

  // Event handlers
  const handleClick = () => {
    onAction();
  };

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Render
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

#### File Naming
- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with 'use' prefix (`useProducts.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Types: PascalCase (`ProductTypes.ts`)
- Styles: camelCase or kebab-case (`ProductCard.css`)

#### Directory Structure
- One component per directory
- Include index.ts for clean imports
- Place stories alongside components
- Group related hooks together

### Testing Preferences

#### Unit Tests
- Test component behavior, not implementation
- Use React Testing Library
- Test user interactions
- Mock external dependencies

#### Component Tests
- Test with different props
- Test edge cases
- Test error states
- Test loading states

#### E2E Tests
- Test critical user flows
- Test navigation
- Test form submissions
- Test data persistence

### Git Workflow

#### Commit Messages
- Use conventional commits
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(components): add ProductCard component`

#### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

#### Pull Requests
- Descriptive title
- Clear description of changes
- Link to related issues
- Request review from at least one team member

## Learnings and Project Insights

### Technical Insights

#### 1. React Compiler Impact
- Automatically optimizes components
- Reduces need for manual useMemo/useCallback
- Improves performance without extra code
- Need to be mindful of dependency arrays in useEffect

#### 2. Tailwind CSS 4.x
- New configuration format is simpler
- Better TypeScript support
- Faster build times
- Easier customization

#### 3. Ant Design Mobile
- Good mobile components out-of-the-box
- TypeScript support is solid
- Documentation is comprehensive
- Some customization limitations

#### 4. React Router v7
- Cleaner API than v6
- Better TypeScript support
- Simpler route definitions
- Improved performance

### Process Insights

#### 1. Component-First Development
- Build components in isolation first
- Use Storybook for visual testing
- Compose components into screens
- Test integration last

#### 2. Mobile-First Approach
- Start with mobile layout
- Use Tailwind's mobile-first breakpoints
- Test on actual devices
- Desktop comes later

#### 3. Documentation Importance
- Memory Bank helps maintain context
- Regular updates are crucial
- Share decisions and rationale
- Document patterns and preferences

### Challenges Encountered

#### 1. TypeScript Configuration
- Multiple tsconfig files can be confusing
- Need to understand app vs node configs
- Strict mode catches more errors initially
- Better long-term code quality

#### 2. ESLint Flat Config
- New format in ESLint 9
- Different from .eslintrc format
- More flexible but less familiar
- Good for monorepos and complex setups

## Known Issues and Limitations

### Current Limitations
1. **No Data Persistence**: All data is lost on refresh
2. **No Product Data**: Mock data not yet created
3. **No Validation**: Form inputs not validated
4. **No Error Handling**: No error boundaries or error states
5. **No Loading States**: No visual feedback during operations

### Known Issues
1. **Navigation**: Bottom navigation might overlap content on some screens
2. **Responsive Design**: Not tested on various screen sizes yet
3. **Accessibility**: No ARIA labels or keyboard navigation yet
4. **Performance**: Not optimized yet (React Compiler is only optimization)

### Future Improvements
1. Add error boundaries for graceful error handling
2. Implement loading states for async operations
3. Add skeleton screens for better perceived performance
4. Optimize images and assets
5. Add offline support with service worker

## Dependencies and Integration Points

### Current Dependencies
- React 19.2.0 (UI framework)
- React Router v7.10.1 (Routing)
- Tailwind CSS 4.1.18 (Styling)
- antd-mobile 5.42.1 (UI components)
- Zustand 5.0.9 (State management - planned)

### External Integrations (Future)
- **Phase 2**: LocalStorage/IndexedDB
- **Phase 3**: Recipe API, Barcode scanner
- **Phase 4**: Firebase (Auth, Firestore, Storage)

## Environment Configuration

### Development
- **Node Version**: v18+
- **Package Manager**: npm
- **Dev Server**: Vite (port 5173)
- **Storybook**: Port 6006

### Build
- **Build Tool**: Vite
- **Output**: dist/ directory
- **Target**: Modern browsers (ES2020+)

## Team and Collaboration

### Current Team Structure
- **Frontend Developer**: Building UI components and screens
- **Product Owner**: Defining requirements and priorities
- **Designer**: Creating design system and mockups (future)

### Communication Channels
- **GitHub Issues**: Track bugs and features
- **Pull Requests**: Code reviews and discussions
- **Documentation**: Memory Bank and README

## Metrics and KPIs

### Development Metrics
- **Components Built**: 5 (App, BottomNavigation, Container, Header, Screens)
- **Screens Implemented**: 5 (placeholders)
- **Storybook Stories**: 2 (Container, Header)
- **Test Coverage**: 0% (testing not started yet)

### Project Metrics
- **Phase Progress**: 20% (Phase 1 of 4)
- **Estimated Time Remaining**: 6-8 weeks for Phase 1
- **Lines of Code**: ~500 (excluding dependencies)

## Risks and Mitigation

### Technical Risks
1. **Risk**: React Compiler stability
   - **Mitigation**: Monitor for issues, have fallback to manual optimization
   
2. **Risk**: Tailwind CSS 4.x breaking changes
   - **Mitigation**: Pin version, monitor updates
   
3. **Risk**: Browser compatibility
   - **Mitigation**: Test on target browsers, use polyfills if needed

### Project Risks
1. **Risk**: Scope creep
   - **Mitigation**: Clear phase boundaries, prioritize MVP features
   
2. **Risk**: Timeline delays
   - **Mitigation**: Regular progress reviews, adjust priorities
   
3. **Risk**: User adoption
   - **Mitigation**: User testing, feedback loops, iterate quickly

## Next Steps Prioritization

### High Priority (This Week)
1. Create design system documentation
2. Define Product data model
3. Build ProductCard component
4. Build ProductList component

### Medium Priority (Next 2 Weeks)
1. Implement HomeScreen with product list
2. Create AddProductScreen with form
3. Set up Zustand store
4. Add localStorage persistence

### Low Priority (Next Month)
1. Implement search functionality
2. Add filtering logic
3. Create ProductDetailScreen
4. Add form validation

## Questions and Clarifications Needed

### Open Questions
1. Should we use IndexedDB or LocalStorage for product data?
2. What barcode scanning library should we use?
3. How should we handle product images (Base64 or file system)?
4. Should we use a form validation library or custom validation?

### Decisions Needed
1. Finalize design system (colors, typography, spacing)
2. Confirm component library usage (antd-mobile vs custom)
3. Define testing strategy (unit vs integration vs E2E focus)
4. Plan deployment strategy (Vercel vs Netlify)