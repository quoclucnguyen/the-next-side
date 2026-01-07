# Tech Context: The Next Side - Pantry Management App

## Technology Stack

### Frontend Framework
**React 19.2.0**
- Latest version with React Compiler enabled
- TypeScript for type safety
- Server Components support (future consideration)
- Concurrent features (Suspense, Transitions)

**Key Features Used:**
- Functional components with hooks
- JSX/TSX syntax
- Fragment (<>...</>)
- Conditional rendering
- List rendering with keys

### Build Tool
**Vite 7.2.4**
- Fast HMR (Hot Module Replacement)
- Optimized build process
- ES modules support
- Plugin ecosystem

**Scripts:**
- `npm run dev`: Development server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run lint`: ESLint checking

### State Management
**Zustand 5.0.9** (Planned for Phase 2)
- Lightweight state management
- TypeScript support
- No boilerplate
- Performance optimized
- DevTools integration

**Current State (Phase 1):**
- Component-level state with React hooks
- No global state yet

### Styling
**Tailwind CSS 4.1.18**
- Utility-first CSS framework
- Responsive design utilities
- Custom theme support
- JIT (Just-In-Time) compiler
- @tailwindcss/vite plugin for Vite integration

**Configuration:**
- Tailwind v4 with new configuration format
- Custom colors and design tokens
- Responsive breakpoints
- Dark mode support (future)

**Design System:**
- **Primary Color**: Cam nhấn (#FF6B35)
- **Background**: Trắng (#FFFFFF)
- **Text**: Đen/xám đậm (#333333)
- **Border**: Xám nhạt (#E0E0E0)
- **Success**: Xanh lá (#4CAF50)
- **Warning**: Vàng (#FFC107)
- **Error**: Đỏ (#F44336)

### Routing
**React Router v7.10.1**
- Client-side routing
- Dynamic routes
- Route protection (future)
- Navigation hooks

**Routes Implemented:**
- `/` → HomeScreen
- `/search` → SearchScreen
- `/add-product` → AddProductScreen
- `/recipes` → RecipesScreen
- `/profile` → ProfileScreen

**Future Routes:**
- `/product/:id` → ProductDetailScreen
- `/recipe/:id` → RecipeDetailScreen
- `/shopping-list` → ShoppingListScreen

### UI Components Library
**Ant Design Mobile (antd-mobile) 5.42.1**
- Mobile-optimized components
- TypeScript support
- Well-documented
- Responsive design

**Components Used:**
- Navigation components
- Form components (future)
- List components (future)
- Modal/Dialog (future)

**Icons:**
- Ant Design Icons 0.3.0
- Material Design icons

### Type Safety
**TypeScript 5.9.3**
- Static type checking
- Interface definitions
- Type inference
- Generic types

**Configuration:**
- `tsconfig.json`: Base TypeScript config
- `tsconfig.app.json`: App-specific config
- `tsconfig.node.json`: Node-specific config

**Strict Mode:** Enabled

### Code Quality Tools

#### ESLint 9.39.1
**Plugins:**
- `eslint-plugin-react-hooks`: React hooks rules
- `eslint-plugin-react-refresh`: Fast refresh optimization
- `eslint-plugin-storybook`: Storybook linting

**Configuration:** Flat config format (new in ESLint 9)

**Rules:**
- React best practices
- TypeScript rules (future)
- Code consistency
- Error prevention

#### React Compiler 1.0.0
- Automatic memoization
- Performance optimization
- Reduces need for manual useMemo/useCallback
- Experimental but stable for production use

### Testing Stack

#### Unit/Integration Testing
**Vitest 4.0.15**
- Fast unit test runner
- Compatible with Jest API
- TypeScript support
- Watch mode

**Libraries:**
- `@testing-library/react` 16.3.1: Component testing
- `@testing-library/jest-dom` 6.9.1: Custom matchers
- `@vitest/coverage-v8`: Code coverage

#### E2E Testing
**Playwright 1.57.0**
- Cross-browser testing
- Mobile testing support
- Headless and headed modes
- Parallel execution

**Browser Support:**
- Chromium
- Firefox
- WebKit (Safari)
- Mobile browsers

#### Component Testing
**@vitest/browser-playwright**: Browser component testing

#### Visual Testing
**Storybook 10.1.11**
- Component isolation
- Interactive documentation
- Visual regression testing
- Design system documentation

**Addons:**
- `@storybook/addon-vitest`: Vitest integration

### Development Tools

#### Package Management
**npm** (package-lock.json)
- Node.js package manager
- Dependency resolution
- Lock file for consistency

#### Version Control
**Git**
- Repository hosted on GitHub
- Current commit: 7a609c30bdd0acce08550ec7dd1317bb6df23951
- Remote: https://github.com/quoclucnguyen/the-next-side.git

## Project Structure

### Directory Layout
```
the-next-side/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BottomNavigation/
│   │   ├── Container/
│   │   └── Header/
│   ├── hooks/              # Custom hooks
│   │   ├── useBreakpoint.ts
│   │   ├── useResizeObserver.ts
│   │   └── useScrollPosition.ts
│   ├── layouts/            # Layout components (empty)
│   ├── screens/            # Screen components
│   │   ├── AddProductScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── RecipesScreen.tsx
│   │   └── SearchScreen.tsx
│   ├── stories/            # Storybook stories
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root component
│   ├── App.css             # Global styles
│   ├── main.tsx            # Entry point
│   └── index.css           # CSS reset/imports
├── public/                 # Static assets
├── docs/                   # Documentation
│   └── components/
├── memory-bank/            # Project documentation
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── README.md
```

## Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on: http://localhost:5173

### Building
```bash
npm run build
```
Output: `dist/` directory

### Linting
```bash
npm run lint
```

### Storybook
```bash
npm run storybook
```
Runs on: http://localhost:6006

### Testing
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests (Playwright)
```

## Technical Constraints

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions
- Mobile browsers (iOS Safari, Chrome Android)
- No IE support

### Platform Target
- **Primary**: Mobile web (iOS Safari, Chrome Android)
- **Secondary**: Desktop web (Chrome, Firefox, Safari, Edge)

### Performance Targets
- Initial load: < 3s on 3G
- Time to Interactive: < 5s
- Frame rate: 60fps during interactions
- Bundle size: < 500KB (gzipped)

### Accessibility
- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management

## Dependencies

### Production Dependencies
```json
{
  "@tailwindcss/vite": "^4.1.18",
  "antd-mobile": "^5.42.1",
  "antd-mobile-icons": "^0.3.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.10.1",
  "tailwindcss": "^4.1.18",
  "zustand": "^5.0.9"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.39.1",
  "@storybook/addon-vitest": "^10.1.11",
  "@storybook/react-vite": "^10.1.11",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.1",
  "@types/node": "^24.10.4",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "@vitest/browser-playwright": "^4.0.15",
  "@vitest/coverage-v8": "^4.0.15",
  "babel-plugin-react-compiler": "^1.0.0",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "eslint-plugin-storybook": "^10.1.11",
  "globals": "^16.5.0",
  "playwright": "^1.57.0",
  "storybook": "^10.1.11",
  "typescript": "~5.9.3",
  "typescript-eslint": "^8.46.4",
  "vite": "^7.2.4",
  "vitest": "^4.0.15"
}
```

## Integration Points

### Future Integrations

#### Phase 2: Local Storage
- LocalStorage API for data persistence
- IndexedDB for larger datasets (optional)

#### Phase 3: External Services
- Recipe API integration
- Barcode scanning API
- Push notification service

#### Phase 4: Backend Services
- Firebase Authentication
- Firestore Database
- Firebase Storage (images)
- Cloud Functions

## Deployment

### Current State
- No deployment configured yet
- Local development only

### Planned Deployment (Phase 4)
- **Frontend**: Vercel or Netlify
- **Backend**: Firebase
- **CDN**: Cloudflare (assets)
- **Monitoring**: Sentry (errors)

### Build Optimization
- Code splitting
- Tree shaking
- Asset compression
- Lazy loading
- Image optimization

## Environment Variables

### Current
No environment variables used yet.

### Planned (Phase 4)
```env
VITE_API_URL=https://api.thenextside.com
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_ANALYTICS_ID=xxx
```

## Code Patterns

### TypeScript Patterns

#### Component Props
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  isActive?: boolean; // Optional
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  isActive = false 
}) => {
  return <div>{title}</div>;
};
```

#### Custom Hooks
```typescript
const useCustomHook = (param: string) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [param]);
  
  return { state, setState };
};
```

### React Patterns

#### Functional Components
```typescript
const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </div>
  );
};
```

#### Conditional Rendering
```typescript
<div>
  {isLoading ? (
    <LoadingSpinner />
  ) : error ? (
    <ErrorMessage />
  ) : (
    <Content />
  )}
</div>
```

## Performance Considerations

### Optimization Strategies
1. **React Compiler**: Automatic memoization
2. **Code Splitting**: Lazy route loading (future)
3. **Image Optimization**: Lazy loading and responsive images (future)
4. **Bundle Analysis**: Regular size monitoring
5. **Caching**: Service worker for offline support (future)

### Monitoring (Future)
- Web Vitals tracking
- Error tracking (Sentry)
- Performance monitoring
- User analytics

## Security Considerations

### Current Implementation
- HTTPS enforced (production)
- Input validation (future)
- XSS prevention (React handles most)
- Content Security Policy (future)

### Planned (Phase 4)
- API rate limiting
- Token-based authentication
- Data encryption at rest
- Secure API communication

## Development Workflow

### Code Style
- Prettier for formatting (future)
- ESLint for linting
- Conventional Commits (recommended)
- PR reviews required

### Testing Strategy
- Unit tests for utilities and hooks
- Component tests for UI components
- E2E tests for critical user flows
- Visual regression tests with Storybook

### Documentation
- JSDoc comments for complex functions
- Component documentation in Storybook
- Memory Bank for project context
- README for setup instructions