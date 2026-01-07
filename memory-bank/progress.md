# Progress: The Next Side - Pantry Management App

## Overall Project Status

### Current Phase: Food Inventory Components - Phase 1-6
**Timeline**: Q1 2026  
**Status**: In Progress  
**Progress**: 83% Complete  
**Estimated Completion**: 1 week for Inventory System

---

## What Works ✅

### Infrastructure & Setup
- ✅ **Project initialization**: React 19 + TypeScript + Vite setup completed
- ✅ **Development environment**: Node.js v18+, npm configured
- ✅ **Build system**: Vite with HMR working
- ✅ **Code quality tools**: ESLint, React Compiler, TypeScript configured
- ✅ **Testing setup**: Vitest, Playwright, Storybook configured
- ✅ **Version control**: Git repository initialized on GitHub

### Core Architecture
- ✅ **Routing**: React Router v7 with 5 main routes implemented
  - `/` → HomeScreen
  - `/search` → SearchScreen
  - `/add-product` → AddProductScreen
  - `/recipes` → RecipesScreen
  - `/profile` → ProfileScreen
- ✅ **Navigation**: BottomNavigation component with 5 tabs
- ✅ **Responsive design**: Mobile-first approach implemented
- ✅ **Component structure**: Organized directory structure with index.ts files

### Food Inventory System - Phase 1: Foundation ✅ COMPLETED
- ✅ **Types & Interfaces** (`src/types/inventory/`)
  - `types.ts`: FoodItem, FoodItemRow, FoodFormValues interfaces, FoodItemStatus type, helper functions
  - `constants.ts`: CATEGORIES array (8 categories), UNITS array (8 units), DEFAULT_FORM_VALUES, validation messages, status labels/colors
  - `index.ts`: Export all types and constants
- ✅ **Mock Data** (`src/mocks/inventory/`)
  - `foodItems.ts`: 30 mock food items with varied expiration dates, categories, units
  - Helper functions: getMockFoodItems, getMockFoodItemsByCategory, searchMockFoodItems, getExpiringSoonMockItems, getExpiredMockItems
- ✅ **Utilities** (`src/utils/inventory/`)
  - `dateUtils.ts`: Date formatting, getDaysRemaining, getExpirationText, isExpiringSoon, isExpired, getTimeAgo, formatDateForInput, getTodayISO, getDateAfterDays
  - `imageUtils.ts`: IMAGE_CONFIG, resizeImage, validateImageFile, fileToBase64, formatFileSize, createPreviewUrl, revokePreviewUrl, processImageFile, isValidBase64Image, downloadBase64Image
- ✅ **Zustand Store** (`src/stores/inventory/`)
  - `inventoryStore.ts`: Full store with state (foodItems, isLoading, isFetching, hasMore, currentPage, pageSize, categoryFilter, searchQuery), actions (addFoodItem, updateFoodItem, deleteFoodItem, loadMoreItems, refetch, resetPagination, setCategoryFilter, setSearchQuery, clearFilters, setLoading, setFetching, clearItems), selectors (getItemById, getExpiringItems, getFilteredItems), middleware (devtools, persist)
- ✅ **Dependencies Installed**: @redux-devtools/extension, react-hook-form, zod, @hookform/resolvers, dayjs

### Food Inventory System - Phase 2: Core Components ✅ COMPLETED
- ✅ **EmptyState Component** (`src/components/inventory/EmptyState.tsx`)
  - Uses antd-mobile Empty component
  - Shows icon, title, description, CTA button
  - Props: title?, description?, actionText?, onAction?, className?
- ✅ **LoadMoreButton Component** (`src/components/inventory/LoadMoreButton.tsx`)
  - Uses antd-mobile Button with loading state
  - Shows "Xem thêm" text with loading indicator
  - Props: hasMore, isLoading, onLoadMore, className?
- ✅ **ImageField Component** (`src/components/inventory/ImageField.tsx`)
  - Image preview with object URL
  - Upload button (input type=file)
  - Remove button
  - Loading state during processing
  - Error handling and validation
  - Uses processImageFile utility for resizing
  - Props: value?, onChange?, error?, disabled?, className?, maxSize?, maxWidth?, maxHeight?

### Food Inventory System - Phase 3: Form Components ✅ COMPLETED
- ✅ **FoodFormFields Component** (`src/components/inventory/FoodFormFields.tsx`)
  - Name: Input (required, min 1 char, max 100)
  - Quantity: Stepper (required, min 1, max 999)
  - Unit: Picker with UNITS array (8 units)
  - Expiration Date: DatePicker with min date = today, max date = today + 365 days
  - Category: Picker with CATEGORIES array (8 categories)
  - Uses antd-mobile Form for form state
  - Full validation with error messages
  - Disabled state when submitting
  - Props: form, disabled?

- ✅ **CreateFoodDrawer Component** (`src/components/inventory/CreateFoodDrawer.tsx`)
  - Uses antd-mobile Popup (slide-up panel)
  - Title: "Thêm thực phẩm"
  - Description: "Nhập đầy đủ thông tin để lưu vào kho"
  - Includes ImageField + FoodFormFields
  - Submit button with loading state
  - Cancel button to close drawer
  - On success: close drawer + show toast + add to Zustand store
  - Auto-reset form on close
  - Props: visible, onClose, onSuccess?

- ✅ **EditFoodDrawer Component** (`src/components/inventory/EditFoodDrawer.tsx`)
  - Reuses CreateFoodDrawer structure
  - Pre-fills form with existing item data
  - Title: "Chỉnh sửa thực phẩm"
  - Description: "Cập nhật thông tin thực phẩm"
  - Update button instead of create
  - Handles image change (optional)
  - Auto-reset form on close
  - Props: visible, onClose, onSuccess?, item

### Food Inventory System - Phase 4: Display Components ✅ COMPLETED
- ✅ **InventoryItemCard Component** (`src/components/inventory/InventoryItemCard.tsx`)
  - Image preview (80x80) with emoji placeholder when no image
  - Name with truncation
  - Quantity + unit display
  - Category display
  - Status badge with color coding:
    - Normal: green badge "Bình thường"
    - Expiring-soon: yellow badge "Sắp hết hạn"
    - Expired: red badge "Đã hết hạn"
  - Expiration info with days remaining
  - Edit and Delete action buttons
  - Click to open details
  - Hover effects and transitions
  - Props: item, onEdit?, onDelete?, onClick?, className?

- ✅ **InventoryItemDrawer Component** (`src/components/inventory/InventoryItemDrawer.tsx`)
  - Slide-up drawer from right (responsive on mobile)
  - Large image display (aspect-square)
  - Full metadata display:
    - Name and status badge
    - Basic info list (quantity, unit, category, expiration)
    - Expiration status with emoji indicator
    - Creation and update dates (with "X ngày trước" format)
  - Edit and Delete action buttons
  - Close button in header
  - Scrollable content area
  - Props: visible, onClose, item, onEdit?, onDelete?

### Food Inventory System - Phase 5: Hooks ✅ COMPLETED
- ✅ **useInfiniteInventory Hook** (`src/hooks/inventory/useInfiniteInventory.ts`)
  - Manages infinite inventory list with pagination and filtering
  - Returns data, loading states, and actions
  - Uses Zustand store for state management
  - Computed filtered items based on category and search query
  - Actions:
    - `fetchNextPage`: Load more items
    - `refetch`: Reload data from scratch
    - `setCategoryFilter`: Filter by category (resets pagination)
    - `setSearchQuery`: Search by name (resets pagination)
    - `clearFilters`: Reset all filters (resets pagination)
  - Stats: totalCount, filteredCount
  - Optimized with useCallback and useMemo to avoid unnecessary re-renders
  - Returns:
    ```typescript
    {
      foodItems, filteredItems,
      isLoading, isFetching, hasMore,
      fetchNextPage, refetch,
      categoryFilter, searchQuery,
      setCategoryFilter, setSearchQuery, clearFilters,
      totalCount, filteredCount
    }
    ```

- ✅ **useDeleteFoodItem Hook** (`src/hooks/inventory/useDeleteFoodItem.ts`)
  - Handles delete with confirm dialog
  - Shows antd-mobile Dialog.confirm with item name
  - Optimistic update: deletes immediately
  - Toast feedback: success/failure messages
  - Error handling with rollback (adds item back if delete fails)
  - Returns:
    ```typescript
    {
      handleDelete: (item: FoodItem) => void,
      isDeleting: boolean
    }
    ```

- ✅ **Index File** (`src/hooks/inventory/index.ts`)
  - Exports both hooks for easy import

### Completed Components
- ✅ **App.tsx**: Root component with routing setup
- ✅ **BottomNavigation**: Fixed position navigation with active state
- ✅ **Container**: Responsive container wrapper with padding and max-width
- ✅ **Header**: Reusable page header with optional back/action buttons
- ✅ **Screen Placeholders**: 5 screen components with basic structure

### Custom Hooks
- ✅ **useBreakpoint.ts**: Responsive breakpoint detection
- ✅ **useResizeObserver.ts**: Element size tracking
- ✅ **useScrollPosition.ts**: Scroll position tracking
- ✅ **useInfiniteInventory**: Inventory list management with pagination and filtering
- ✅ **useDeleteFoodItem**: Delete handler with confirm dialog and toast feedback

### Documentation
- ✅ **Memory Bank**: Complete project documentation created
  - projectbrief.md
  - productContext.md
  - systemPatterns.md
  - techContext.md
  - activeContext.md
  - progress.md (this file)
- ✅ **README.md**: Basic project documentation
- ✅ **Component Docs**: Storybook stories for Container and Header

### Development Tools
- ✅ **Storybook**: Running on port 6006
- ✅ **Dev Server**: Running on port 5173
- ✅ **Build Process**: Vite build working
- ✅ **Linting**: ESLint configured and working

---

## What's Left to Build 🚧

### Phase 4: Display Components ✅ COMPLETED

### Phase 5: Hooks ✅ COMPLETED

### Phase 6: Integration (High Priority)
- [ ] **Create Index Files**
  - [x] Create `src/components/inventory/index.ts`
  - [x] Create `src/hooks/inventory/index.ts`

- [ ] **Documentation**
  - [x] Update memory bank with new components and hooks
  - [ ] Document hooks usage with examples
  - [ ] Add component usage examples

### Screen Integration (After Phase 6)
- [ ] **HomeScreen Integration**
  - [ ] Replace placeholder with inventory components
  - [ ] Add search bar component
  - [ ] Add filter tabs (All categories)
  - [ ] Add floating action button for create
  - [ ] Implement filter logic with useInfiniteInventory
  - [ ] Implement search logic with useInfiniteInventory

- [ ] **Food Inventory Screen**
  - [ ] Create dedicated inventory list screen
  - [ ] Use InventoryItemCard for display
  - [ ] Use CreateFoodDrawer for adding items
  - [ ] Use EditFoodDrawer for editing items
  - [ ] Use useInfiniteInventory for data management
  - [ ] Add infinite scroll with LoadMoreButton
  - [ ] Use EmptyState for empty list

- [ ] **ProductDetailScreen Integration**
  - [ ] Replace placeholder with InventoryItemDrawer
  - [ ] Add edit/delete functionality
  - [ ] Show purchase history (placeholder)
  - [ ] Add recipe suggestions (placeholder)

### Other Features (Lower Priority)
- [ ] **RecipesScreen Enhancement**
  - [ ] Create RecipeCard component
  - [ ] Create RecipeList component
  - [ ] Add filter options
  - [ ] Add search functionality
  - [ ] Create mock recipe data

- [ ] **ProfileScreen Enhancement**
  - [ ] Add user avatar
  - [ ] Add user settings
  - [ ] Add notification preferences
  - [ ] Add app settings
  - [ ] Add about section

- [ ] **SearchScreen Enhancement**
  - [ ] Add search input
  - [ ] Add filters (category, expiration status)
  - [ ] Implement search logic
  - [ ] Add search results display
  - [ ] Add clear search button

- [ ] **Error Handling**
  - [ ] Create error boundary component
  - [ ] Add error states to screens
  - [ ] Add error messages to forms
  - [ ] Create error modal component

- [ ] **Loading States**
  - [ ] Create loading spinner component
  - [ ] Create skeleton screens
  - [ ] Add loading states to all async operations

---

## Known Issues 🐛

### Current Issues
1. **No Data Persistence**: All data is lost on page refresh
   - **Priority**: Medium
   - **Phase**: Already addressed with Zustand persist middleware ✅
   - **Solution**: Already implemented

2. **Bottom Navigation Overlap**: Navigation might overlap content on some screens
   - **Priority**: Medium
   - **Phase**: Phase 1
   - **Solution**: Add proper padding to bottom of screens

3. **No Loading States**: No visual feedback during operations
   - **Priority**: Medium
   - **Phase**: Phase 1
   - **Solution**: Already addressed with LoadMoreButton component ✅

4. **No Error Handling**: No error boundaries or error states
   - **Priority**: Medium
   - **Phase**: Phase 1
   - **Solution**: Implement error boundaries

5. **No Form Validation**: Form inputs are not validated
   - **Priority**: High
   - **Phase**: Phase 3 (Form Components)
   - **Solution**: ✅ Implemented with antd-mobile Form

### Future Considerations
1. **Accessibility**: No ARIA labels or keyboard navigation yet
   - **Priority**: Medium
   - **Phase**: Phase 2
   - **Solution**: Add accessibility features

2. **Performance**: Not optimized beyond React Compiler
   - **Priority**: Low
   - **Phase**: Phase 2
   - **Solution**: Add code splitting, lazy loading

3. **Browser Compatibility**: Not tested on various browsers yet
   - **Priority**: Medium
   - **Phase**: Phase 2
   - **Solution**: Test on target browsers

---

## Technical Debt ⚠️

### Current Technical Debt
1. **No Type Safety in Some Areas**: Some components lack proper TypeScript types
   - **Impact**: Medium
   - **Resolution**: Add proper interfaces and types
   - **Status**: Most components now have proper types ✅

2. **No Tests**: Zero test coverage
   - **Impact**: High
   - **Resolution**: Add unit and integration tests

3. **No Documentation**: Limited inline documentation
   - **Impact**: Medium
   - **Resolution**: Add JSDoc comments

4. **Hardcoded Values**: Some values are hardcoded instead of being configurable
   - **Impact**: Low
   - **Resolution**: Extract to constants or config
   - **Status**: Constants file created for inventory ✅

### Planned Refactoring
1. Extract common logic to custom hooks
2. Implement proper error boundaries
3. Add loading states throughout
4. Improve TypeScript coverage
5. Add comprehensive tests

---

## Evolution of Project Decisions

### Decisions That Changed
1. **Initial Plan**: Use Context API for state management
   - **Changed To**: Zustand (Phase 1) ✅
   - **Reason**: Better performance, less boilerplate
   - **Status**: Implemented

2. **Initial Plan**: Build all components from scratch
   - **Changed To**: Use antd-mobile for UI components
   - **Reason**: Faster development, better mobile support
   - **Status**: Implemented

3. **Initial Plan**: Form validation with react-hook-form + Zod
   - **Changed To**: Use antd-mobile Form for simpler validation
   - **Reason**: Better integration with antd-mobile components, less setup
   - **Status**: Implemented

### Decisions That Stayed the Same
1. **Mobile-First Approach**: Confirmed and maintained ✅
2. **React with TypeScript**: No changes needed ✅
3. **Tailwind CSS**: Working well, no changes needed ✅
4. **Vite Build Tool**: Fast and efficient, no changes needed ✅

---

## Performance Metrics

### Current Performance
- **Build Time**: ~2-3 seconds
- **Dev Server Start**: ~1-2 seconds
- **HMR**: < 100ms
- **Bundle Size**: ~260KB (gzipped) - Target met ✅

### Performance Targets (Future)
- **Initial Load**: < 3s on 3G
- **Time to Interactive**: < 5s
- **Frame Rate**: 60fps during interactions
- **Lighthouse Score**: 90+ across all metrics

---

## Testing Status

### Current Test Coverage
- **Unit Tests**: 0%
- **Integration Tests**: 0%
- **E2E Tests**: 0%
- **Visual Tests**: 2 components (Container, Header) in Storybook

### Testing Goals
- **Phase 1**: 50% unit test coverage for components
- **Phase 2**: 70% unit test coverage + E2E tests for critical flows
- **Phase 3**: 80% test coverage + visual regression tests
- **Phase 4**: 90% test coverage + comprehensive E2E tests

---

## Deployment Status

### Current Deployment
- **Environment**: Local development only
- **No Production Deployment**: Not yet deployed
- **No Staging Environment**: Not yet configured

### Planned Deployment (Phase 4)
- **Frontend**: Vercel or Netlify
- **Backend**: Firebase
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for errors

---

## Metrics and Achievements

### Development Metrics
- **Components Built**: 13 (App, BottomNavigation, Container, Header, Screens, EmptyState, LoadMoreButton, ImageField, FoodFormFields, CreateFoodDrawer, EditFoodDrawer, InventoryItemCard, InventoryItemDrawer)
- **Custom Hooks**: 5 (useBreakpoint, useResizeObserver, useScrollPosition, useInfiniteInventory, useDeleteFoodItem)
- **Screens Implemented**: 5 (placeholders)
- **Custom Hooks**: 3 (useBreakpoint, useResizeObserver, useScrollPosition)
- **Types Defined**: 5 (FoodItem, FoodItemRow, FoodFormValues, FoodItemStatus, constants)
- **Utilities Created**: 15 (date utilities, image utilities)
- **Store Setup**: Zustand inventory store with full CRUD operations
- **Mock Data**: 30 food items with helper functions
- **Storybook Stories**: 2 (Container, Header)
- **Test Coverage**: 0%
- **Lines of Code**: ~3000 (excluding dependencies)

### Project Metrics
- **Phase Progress**: 83% (Food Inventory System Phase 1-5 of 6)
- **Estimated Time Remaining**: 1 week for Inventory System
- **Total Estimated Time**: 6-8 months for all phases

### Achievements
- ✅ Successfully set up React 19 with TypeScript
- ✅ Implemented mobile-first navigation
- ✅ Created reusable component library foundation
- ✅ Set up comprehensive testing tools
- ✅ Enabled React Compiler for automatic optimization
- ✅ Created detailed project documentation (Memory Bank)
- ✅ Built complete Food Inventory data layer (types, constants, mocks, utilities, store)
- ✅ Implemented Phase 2 Core Components (EmptyState, LoadMoreButton, ImageField)
- ✅ **NEW**: Implemented Phase 3 Form Components (FoodFormFields, CreateFoodDrawer, EditFoodDrawer)
- ✅ Set up Zustand store with persist middleware and DevTools
- ✅ Created 30 mock food items with comprehensive helper functions
- ✅ All TypeScript errors resolved
- ✅ Build and ESLint passing with no errors
- ✅ **NEW**: Implemented Phase 4 Display Components (InventoryItemCard, InventoryItemDrawer)
- ✅ **NEW**: Implemented Phase 5 Hooks (useInfiniteInventory, useDeleteFoodItem)

---

## Next Steps

### Immediate Actions (Today)
1. Implement Phase 4: Display Components (InventoryItemCard, InventoryItemDrawer)
2. Add status badges with color coding
3. Implement card layout with Tailwind CSS

### Short-Term Goals (This Week)
1. Complete Phase 4: Display Components
2. Implement Phase 5: Hooks (useInfiniteInventory, useDeleteFoodItem)
3. Complete Phase 6: Integration
4. Begin screen integration

### Medium-Term Goals (Next 2 Weeks)
1. Integrate inventory components into HomeScreen
2. Create dedicated Food Inventory screen
3. Add comprehensive examples and documentation
4. Begin testing inventory system

### Long-Term Goals (Next Month)
1. Complete all inventory system features
2. Add comprehensive tests
3. Implement error handling and loading states
4. Prepare for next feature set

---

## Blockers and Dependencies

### Current Blockers
None at this time.

### External Dependencies
- **Phase 2**: No external dependencies required
- **Phase 3**: No external dependencies required ✅
- **Phase 4**: No external dependencies required

### Internal Dependencies
1. ✅ Food inventory data layer (types, constants, mocks, utilities) - COMPLETED
2. ✅ Zustand store - COMPLETED
3. ✅ Core components (EmptyState, LoadMoreButton, ImageField) - COMPLETED
4. ✅ Form components (FoodFormFields, CreateFoodDrawer, EditFoodDrawer) - COMPLETED
5. Display components must be built before hooks
6. Hooks must be created before screen integration
7. All phases (4-6) must be completed before screen integration

---

## Risk Assessment

### Current Risks
1. **Timeline Risk**: Inventory system might take longer than estimated
   - **Probability**: Medium
   - **Impact**: Medium
   - **Mitigation**: Regular progress reviews, adjust priorities

2. **Scope Creep Risk**: Adding features beyond inventory system
   - **Probability**: Medium
   - **Impact**: High
   - **Mitigation**: Clear phase boundaries, prioritize MVP features

3. **Technical Debt Risk**: Accumulating debt without resolution
   - **Probability**: Low
   - **Impact**: Medium
   - **Mitigation**: Regular refactoring, test coverage

### Resolved Risks
- ✅ React Compiler stability: No issues encountered
- ✅ Tailwind CSS 4.x compatibility: Working well
- ✅ TypeScript strict mode: Adapted successfully
- ✅ Zustand store setup: Successfully implemented with persist middleware
- ✅ Ant Design Mobile Form integration: Successfully implemented
- ✅ Picker and DatePicker components: Working with visible prop

---

## Lessons Learned

### Technical Lessons
1. **React Compiler**: Great for automatic optimization, reduces boilerplate
2. **Tailwind CSS 4.x**: Simpler configuration, better TypeScript support
3. **Ant Design Mobile**: Good mobile components, but some customization limitations
4. **React Router v7**: Cleaner API, better TypeScript support than v6
5. **Zustand**: Lightweight, easy to use, great with persist middleware
6. **Image Handling**: Base64 with resizing is viable for MVP
7. **Antd-mobile Form**: Good integration with components, use visible prop for Picker/DatePicker instead of ref

### Process Lessons
1. **Component-First Development**: Building components in isolation works well
2. **Memory Bank**: Extremely valuable for maintaining context across sessions
3. **Mobile-First Approach**: Starting with mobile layout makes desktop easier
4. **Documentation**: Regular documentation updates are crucial for project health
5. **Phased Development**: Breaking work into phases helps manage complexity

---

## Celebration Milestones 🎉

### Completed Milestones
- ✅ Project initialized with modern tech stack
- ✅ Navigation structure implemented
- ✅ First reusable components created
- ✅ Custom hooks for responsiveness built
- ✅ Memory Bank documentation created
- ✅ Development environment fully configured
- ✅ Food Inventory data layer completed
- ✅ Core inventory components built (Phase 1-2)
- ✅ **NEW**: Form components completed (Phase 3)

### Upcoming Milestones
- 🎯 Complete Display Components (Phase 4)
- 🎯 Complete Custom Hooks (Phase 5)
- 🎯 Complete Integration (Phase 6)
- 🎯 First functional inventory display
- 🎅 Inventory system completed
- 🚀 First production deployment

---

## Update History

### January 7, 2026 - Evening Update
- ✅ Completed Food Inventory Phase 3: Form Components
  - FoodFormFields with full validation
  - CreateFoodDrawer with Zustand integration
  - EditFoodDrawer with pre-fill functionality
- Installed dayjs for date formatting
- Fixed all TypeScript errors (Picker/DatePicker ref issues resolved using visible prop)
- Build and ESLint passing with no errors
- Updated progress to 50% complete
- Updated development metrics (11 components, 3000 lines of code)

### January 7, 2026 - Afternoon Update
- ✅ Completed Food Inventory Phase 1: Foundation (types, constants, mocks, utilities, store)
- ✅ Completed Food Inventory Phase 2: Core Components (EmptyState, LoadMoreButton, ImageField)
- Updated progress to 30% complete
- Updated development metrics (8 components, 2000 lines of code)
- Documented achievements and next steps for Phase 3-6

### January 7, 2026 - Morning
- Created Memory Bank with 6 documentation files
- Documented Phase 1 progress (20% complete)
- Listed completed components and features
- Identified next steps and priorities

### Initial Setup (Prior)
- Project initialized with React 19, TypeScript, Vite
- Navigation structure implemented
- Basic components created
- Development tools configured

---

*Last Updated: January 7, 2026 (Late Evening)*  
*Next Review: After Phase 6 completion*

### January 7, 2026 - Late Evening Update
- ✅ Completed Food Inventory Phase 4: Display Components
  - InventoryItemCard with status badges, actions, and hover effects
  - InventoryItemDrawer with full metadata display and scrollable content
- ✅ Completed Food Inventory Phase 5: Hooks
  - useInfiniteInventory for pagination and filtering management
  - useDeleteFoodItem with confirm dialog and optimistic updates
  - Created index.ts for hooks exports
- Build and ESLint passing with no errors
- Updated progress to 83% complete
- Updated development metrics (13 components, 5 hooks, ~3500 lines of code)
