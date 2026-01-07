# Phân Tích Dự Án: Side My Tools

## Tổng Quan

**Side My Tools** là một **Telegram Mini App** (TMA) cho quản lý kho cá nhân với giao diện mobile-first, được xây dựng bằng React 19 + TypeScript + Vite 7.

### Mission
Xây dựng ứng dụng quản lý kho cá nhân hoạt động trong môi trường Telegram với trải nghiệm giống như ứng dụng native.

### Mục tiêu chính
- Quản lý thực phẩm (Food Inventory)
- Quản lý mỹ phẩm (Cosmetics Management)
- Đồng bộ người dùng với Supabase qua Telegram Bot
- Cấu hình AI (Gemini API key) cho các tính năng AI trong tương lai

---

## Tech Stack

### Frontend Core
- **React 19.1.1** - UI library với React Compiler enabled
- **TypeScript 5.9** - Strict mode enabled
- **Vite 7.1.7** - Build tool với Fast Refresh
- **React Router 7.9.4** - Routing với `createMemoryRouter` cho TMA

### Styling & UI
- **Tailwind CSS 4.1.14** - Styling với inline config (không dùng file config truyền thống)
- **Shadcn UI** - UI primitives (Card, Badge, Alert, Button, Drawer, Select, Label, Input, Textarea, Dropdown Menu)
- **Lucide React** - Icons cho navigation và UI elements
- **Radix UI** - Dialog, Dropdown Menu, Label, Select, Slot primitives
- **tw-animate-css** - Animations bổ sung

### State Management
- **Zustand 5.0.8** - Client-side state (authentication)
- **TanStack Query 5.90.2** - Server state (data fetching, caching, mutations)

### Forms & Validation
- **React Hook Form 7.64.0** - Form management
- **Zod 4.1.12** - Schema validation
- **@hookform/resolvers 5.2.2** - Integration Zod + RHF

### Backend Integration
- **@supabase/supabase-js 2.48.0** - Supabase client
- **@supabase/postgrest-js 2.75.0** - PostgREST client
- **Telegram SDK (@tma.js/sdk-react 3.0.8)** - Telegram Mini App integration

### Media Processing
- **Pica 9.0.1** - Client-side image resizing (max 800px, JPEG)

### Development Tools
- **ESLint 9.36.0** - Code linting với flat config
- **TypeScript ESLint 8.45.0** - Type-aware linting
- **Babel React Compiler 19.1.0-rc.3** - React compiler optimization

---

## Cấu Trúc Dự Án

```
side-my-tools/
├── src/
│   ├── main.tsx              # Router + render entry
│   ├── App.tsx               # Layout/shell với bottom navigation
│   ├── index.css             # Tailwind theme tokens
│   ├── components/
│   │   ├── ui/               # Shadcn UI primitives
│   │   └── AuthGuard.tsx     # Route protection component
│   ├── pages/
│   │   ├── Dashboard.tsx     # Overview screen
│   │   ├── Inventory/       # Food inventory module
│   │   ├── Cosmetics/        # Cosmetics management module
│   │   ├── Settings.tsx      # Settings screen
│   │   └── auth/             # Authentication screens
│   ├── hooks/                # Shared React hooks
│   ├── lib/                  # Utilities and API clients
│   ├── stores/               # Zustand stores
│   └── contexts/             # React contexts
├── supabase-functions/       # Deno-based Edge Functions
│   ├── telegram-bot/         # Telegram bot handler
│   ├── tma-exchange/         # TMA authentication
│   ├── daily-expiring-scanner/ # Daily notifications
│   └── handle-webhook-callback/ # Webhook processor
├── memory-bank/              # Project documentation
└── docs/                     # Additional documentation
```

---

## Các Tính Năng Chính

### 1. Food Inventory (Kho Thực Phẩm)
- **CRUD Operations**: Thêm, xem, cập nhật, xóa thực phẩm
- **Fields**: 
  - Tên thực phẩm (name)
  - Số lượng (quantity)
  - Đơn vị tính (unit)
  - Ngày hết hạn (expiration_date)
  - Danh mục (category)
  - Hình ảnh (image_url) - với resize client-side
- **Features**:
  - Infinite scroll pagination
  - Image upload với resize tối đa 800px
  - Filter/Sort theo ngày hết hạn
  - Alert cho sắp hết hạn
  - Empty state và fallback data

### 2. Cosmetics Management (Quản Lý Mỹ Phẩm)
- **CRUD Operations**: Tương tự Food Inventory
- **Fields**:
  - Tên sản phẩm (name)
  - Thương hiệu (brand)
  - Danh mục (category)
  - Ngày hết hạn (expiry_date)
  - Ngày mở (opened_date)
  - Trạng thái (status: active, expired, discarded)
  - Ghi chú (notes)
  - Hình ảnh (image_url)
- **Features**:
  - Tracking theo ngày mở và hết hạn
  - Status management
  - Notes bổ sung

### 3. User Authentication
- **Telegram Integration**:
  - Custom Telegram Bot cho authentication
  - Sync Telegram users với Supabase
  - Bridge session integration
  - Auth flow qua `tma-exchange` edge function
- **Test Mode**: Có thể test trong browser với `tgWebAppData` query parameter

### 4. User Settings
- **Gemini API Key Configuration**: Cho các tính năng AI tương lai
- **User Preferences**: Lưu trữ trong `user_settings` table
- **Profile Management**: Hiển thị thông tin user

---

## Database Schema

### Tables

#### `public.food_items`
Lưu trữ thông tin thực phẩm.

| Column            | Type          | Constraints                                |
| ----------------- | ------------- | ----------------------------------------- |
| `id`              | `uuid`        | Primary key                               |
| `user_id`         | `uuid`        | FK → `auth.users(id)`, cascade delete     |
| `name`            | `text`        | Required                                  |
| `quantity`        | `numeric`     | Required                                  |
| `unit`            | `text`        | Required                                  |
| `expiration_date` | `date`        | Required                                  |
| `category`        | `text`        | Required                                  |
| `image_url`       | `text`        | Optional                                  |
| `created_at`      | `timestamptz` | Defaults to `now()`                      |
| `updated_at`      | `timestamptz` | Defaults to `now()`                      |

**Indexes**: `idx_food_items_expiration`, `idx_food_items_user_id`

#### `public.cosmetics`
Lưu trữ thông tin mỹ phẩm.

| Column        | Type          | Constraints                                |
| ------------- | ------------- | ----------------------------------------- |
| `id`          | `uuid`        | Primary key                               |
| `user_id`     | `uuid`        | FK → `auth.users(id)`, cascade delete     |
| `name`        | `text`        | Required                                  |
| `brand`       | `text`        | Optional                                  |
| `category`    | `text`        | Optional                                  |
| `expiry_date` | `date`        | Optional                                  |
| `opened_date` | `date`        | Optional                                  |
| `status`      | `text`        | Optional (active, expired, discarded)     |
| `notes`       | `text`        | Optional                                  |
| `image_url`   | `text`        | Optional                                  |
| `created_at`  | `timestamptz` | Defaults to `now()`                      |
| `updated_at`  | `timestamptz` | Defaults to `now()`                      |

#### `public.user_settings`
Lưu trữ cài đặt người dùng.

| Column           | Type          | Constraints                                |
| ---------------- | ------------- | ----------------------------------------- |
| `id`             | `uuid`        | Primary key                               |
| `user_id`        | `uuid`        | FK → `auth.users(id)`, unique, cascade delete |
| `preferences`    | `jsonb`       | Defaults to `{}`                         |
| `gemini_api_key` | `text`        | Optional                                  |
| `created_at`     | `timestamptz` | Defaults to `now()`                      |
| `updated_at`     | `timestamptz` | Defaults to `now()`                      |

**Indexes**: `idx_user_settings_user_id`

#### `public.users`
Lưu trữ thông tin user từ Telegram.

| Column      | Type          | Description                                           |
| ----------- | ------------- | ----------------------------------------------------- |
| `id`        | `uuid`        | Primary Key, FK → `auth.users.id`                     |
| `telegram_id`| `bigint`      | ID từ Telegram, Unique                               |
| `chat_id`   | `bigint`      | ID chat với user                                      |
| `email`     | `text`        | Email tự động (`tg-<telegram_id>@telegram.local`)     |
| `first_name`| `text`        | Tên từ Telegram                                       |
| `last_name` | `text`        | Họ từ Telegram                                        |
| `username`  | `text`        | Username từ Telegram                                  |
| `last_login`| `timestamptz` | Thời gian tương tác cuối cùng                         |
| `created_at`| `timestamptz` | Defaults to `now()`                                  |
| `updated_at`| `timestamptz` | Defaults to `now()`                                  |

### Storage Buckets

#### `food-images`
- **Public**: Có thể (để hiển thị ảnh)
- **Path**: `{user_id}/{uuid}.jpg`

#### `cosmetics-images`
- **Public**: Có thể (để hiển thị ảnh)
- **Path**: `{user_id}/{uuid}.jpg`

---

## Supabase Edge Functions

### 1. `telegram-bot`
**Mục đích**: Xử lý Telegram Bot messages và commands.

**Chức năng**:
- Đăng ký user mới khi bắt đầu chat
- Cập nhật thông tin user
- Gửi thông báo về items sắp hết hạn

### 2. `tma-exchange`
**Mục đích**: Xử lý authentication flow cho Telegram Mini App.

**Chức năng**:
- Xác thực Telegram init data
- Tạo hoặc cập nhật user trong Supabase
- Tạo session cho user
- Return auth token cho frontend

### 3. `daily-expiring-scanner`
**Mục đích**: Quét daily và gửi notification cho các items sắp hết hạn.

**Chức năng**:
- Query items hết hạn trong X ngày tới
- Gửi notification qua Telegram bot
- Logging và error handling

### 4. `handle-webhook-callback`
**Mục đích**: Xử lý webhook callbacks từ các dịch vụ khác.

**Chức năng**:
- Xử lý payment callbacks
- Xử lý subscription events
- Update database theo callback

---

## Routing & Navigation

### Routes
- `/` - Dashboard (Tổng quan)
- `/inventory` - Food Inventory (Kho thực phẩm)
- `/cosmetics` - Cosmetics Management (Mỹ phẩm)
- `/settings` - Settings (Cài đặt)
- `/login` - Authentication (Đăng nhập)

### Navigation Pattern
- **Bottom Navigation**: Persistent shell với 4 tabs chính
- **Memory Router**: Sử dụng `createMemoryRouter` cho TMA compatibility
- **Active State**: Highlight tab hiện tại với scale và gradient effects
- **Header**: Dynamic title theo trang hiện tại với user dropdown menu

---

## Architecture Patterns

### 1. State Management
- **Zustand** cho authentication state (`auth.store.ts`)
- **TanStack Query** cho server state và caching
- **React Context** cho global settings

### 2. Form Management
- **React Hook Form** + **Zod** cho validation
- Custom hooks: `useCosmeticForm`, `useCreateFoodForm`
- Separated form field components

### 3. Data Fetching
- Infinite scroll với custom `useInfiniteQuery` hook
- Automatic caching và refetching
- Optimistic updates cho mutations

### 4. Component Organization
- Page-level components trong `src/pages/`
- Reusable UI components trong `src/components/ui/`
- Module-specific components trong subdirectories
- Shared utilities trong `src/lib/`

### 5. Authentication Flow
1. User mở TMA từ Telegram
2. TMA init data được gửi đến `tma-exchange` function
3. Function xác thực và tạo/update user trong Supabase
4. Session được tạo và return token
4. Frontend nhận token và store trong Zustand
5. Protected routes dùng `AuthGuard` component

---

## Environment Variables

### Frontend (.env or .env.local)
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FOOD_BUCKET=food-images
VITE_TMA_EXCHANGE_URL=optional-override-url
```

### Backend Functions (Supabase Dashboard)
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
TELEGRAM_BOT_TOKEN=your-bot-token
GOTRUE_URL=optional-gotrue-url
```

---

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

---

## Design System

### Tailwind v4 Tokens (src/index.css)
- Inline config (không dùng tailwind.config.js)
- Centralized design tokens:
  - Colors: primary, secondary, accent, destructive, muted, etc.
  - Typography: font sizes, weights, line heights
  - Spacing: consistent spacing scale
  - Shadows: elevation system
  - Border radius: rounded tokens

### UI Components
- **Shadcn UI** primitives với Tailwind styling
- **Card**: Container cho content
- **Badge**: Tags và labels
- **Button**: Primary actions
- **Drawer**: Slide-in panels (vaul library)
- **Select**: Dropdown selections
- **Alert**: Notifications và warnings

### Animations
- **tw-animate-css**: Additional animations
- Custom animations trong Tailwind config:
  - `animate-float`: Floating gradient blobs
  - `transition-smooth`: Smooth transitions

---

## Key Patterns & Best Practices

### 1. Code Style
- 2-space indentation
- Single quotes cho strings
- `@/` alias cho `src/` directory
- Strict TypeScript mode
- ESLint với flat config

### 2. Component Design
- Functional components (no class components)
- Composition over inheritance
- Reusable primitives
- Clear separation of concerns

### 3. Error Handling
- Try-catch trong async functions
- Error boundaries (nếu cần)
- User-friendly error messages
- Logging cho debugging

### 4. Performance
- React Compiler enabled
- Code splitting với React.lazy
- Image optimization (Pica resize)
- Debounce và throttle khi cần
- TanStack Query caching

### 5. Testing Authentication in Browser
Để test TMA auth trong browser thông thường:
```
http://localhost:5173/?tgWebAppData=<YOUR_INIT_DATA>
```

---

## Constraints & Guardrails

- ✅ React 19 + Vite 7
- ✅ Mobile-first layout (360-420px viewport)
- ✅ Tailwind v4 với inline config
- ✅ Shadcn UI primitives
- ❌ Không dùng class components
- ❌ Không reintroduce legacy Tailwind config
- ❌ Không break Telegram Mini App compatibility
- ✅ Strict TypeScript
- ✅ ESLint và build phải pass trước khi ship

---

## Success Criteria

- ✅ App boots không có warnings với `npm run dev`
- ✅ Navigation mượt mà và giữ shell giữa routes
- ✅ Responsive trên narrow viewports (360-420px)
- ✅ Design tokens centralized trong `index.css`
- ✅ Telegram Mini App authenticates users seamlessly
- ✅ Food và cosmetics CRUD operations hoạt động
- ✅ Image upload và display hoạt động đúng
- ✅ Documentation sync với code paths
- ✅ Database schema documented trong `docs/database-structure.md`

---

## Học Hữu Ích Cho Dự Án Khác

### 1. Telegram Mini App Integration
- Pattern: Custom bot authentication flow
- Use case: Bất kỳ app nào cần Telegram integration
- Key: TMA SDK + Supabase edge functions

### 2. Mobile-First Design
- Pattern: Sticky header + bottom navigation + scrollable content
- Use case: Mobile applications, PWA
- Key: Tailwind responsive classes

### 3. State Management Hybrid
- Pattern: Zustand (client) + TanStack Query (server)
- Use case: Apps với cả client và server state
- Key: Clear separation of concerns

### 4. Image Handling
- Pattern: Client-side resize (Pica) + Supabase Storage
- Use case: Apps với user-generated images
- Key: Resize trước upload để tối ưu bandwidth

### 5. Infinite Scroll
- Pattern: Custom hook với TanStack Query
- Use case: Lists với nhiều items
- Key: Paginated API + cursor-based pagination

### 6. Form Management
- Pattern: RHF + Zod + validation
- Use case: Complex forms với validation
- Key: Type-safe validation và clean form code

---

## Tài Liệu Tham Khảo

- [React 19 Documentation](https://react.dev)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com/docs)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

---

**Ngày tạo**: 2026-01-07  
**Dự án gốc**: /home/quocl/workspaces/side-my-tools  
**Tài liệu phân tích tại**: /home/quocl/workspaces/the-next-side/docs