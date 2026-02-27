# MTF CRM Client - AI Agent Guide

## Project Overview

MTF CRM Client is a React-based Customer Relationship Management (CRM) web application for e-commerce businesses. It provides both an admin dashboard for managing products, orders, users, and a customer-facing website for browsing products and placing orders.

The application supports bilingual interface (English/Vietnamese) and real-time notifications via WebSocket.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.2.0 |
| Language | TypeScript 5.2.2 |
| Build Tool | Vite 5.1.4 |
| Styling | Tailwind CSS 3.4.1 + SCSS |
| UI Library | Ant Design 5.26.4 |
| State Management | Redux Toolkit 2.2.1 + redux-persist |
| Routing | React Router DOM 6.22.3 |
| HTTP Client | Axios 1.10.0 |
| Form Handling | React Hook Form 7.51.1 + Zod 3.22.4 |
| i18n | i18next 25.3.2 + react-i18next 15.6.0 |
| Real-time | Socket.io-client 4.8.3 |
| Charts | Recharts 3.6.0 |

## Project Structure

```
src/
├── +core/                    # Core infrastructure
│   ├── api/                  # API clients (per feature)
│   ├── constants/            # Constants (API tags, auth, commons)
│   ├── helpers/              # Utility helpers
│   ├── provider/             # React context providers
│   ├── services/             # Local storage & socket services
│   └── themes/               # Theme colors configuration
├── components/
│   ├── global/               # Global shared components (layouts, headers, etc.)
│   └── ui/                   # Reusable UI components
├── config/                   # Static config (icons, images)
├── hooks/                    # Global custom hooks
├── i18n/                     # Internationalization config
│   └── locales/              # Translation files (en, vi)
├── pages/                    # Feature-based page components
│   ├── [feature]/            # Each feature has: components/, hooks/, pages/
│   ├── website-[feature]/    # Customer-facing pages
│   └── ...
├── routes/                   # Route definitions
│   ├── router.tsx            # Main router
│   ├── admin.router.tsx      # Admin routes
│   ├── website.router.tsx    # Website routes
│   └── auth.router.tsx       # Auth routes
├── store/                    # Redux store
│   ├── actions/              # Redux actions
│   ├── reducers/             # Redux reducers
│   └── store.ts              # Store configuration
├── styles/                   # Global styles
│   ├── globals.scss          # Global SCSS + Tailwind directives
│   ├── _variables.scss       # SCSS variables
│   └── _index.scss           # SCSS index
└── types/                    # TypeScript type definitions
```

## Application Architecture

### Route Structure

The app has three main route groups:

1. **Website Routes** (`/`) - Customer-facing pages
   - Home, Products, Categories, Checkout
   - User Profile, Orders
   - FAQ, Policies

2. **Admin Routes** (`/admin`) - Management dashboard
   - Dashboard with statistics
   - CRUD for: Categories, Products, Orders, Payments
   - User management, Reviews, Store management
   - Website template configuration
   - FAQ and Policy management

3. **Auth Routes** (`/xac-thuc/*`) - Authentication
   - Login, Register, Forbidden

### State Management

- **Redux Toolkit**: Global state for user authentication and cart
- **redux-persist**: Persists cart state to localStorage
- **React Context**: App configuration (website template settings)

### API Architecture

- Centralized axios instance at `+core/api/api.instance.ts`
- Request interceptor: Adds JWT token from cookies, sets language header
- Response interceptor: Global error handling with Ant Design message, auto-logout on 401
- Feature-based API files: `product.api.ts`, `order.api.ts`, etc.

### Custom Hooks Pattern

Each feature follows a consistent hook pattern:
- `useList.tsx` - Fetch paginated list with params
- `useDetail.tsx` - Fetch single item by ID
- `useCreate.tsx` - Create mutation
- `useEdit.tsx` - Update mutation
- `useDelete.tsx` - Delete mutation

Example from `useList.tsx`:
```typescript
export const useList = (initialParams?: Record<string, any>, options?: UseListOptions) => {
  const [data, setData] = useState<Product[]>([]);
  const [paging, setPaging] = useState<PagingType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // ... request cancellation, delay loading support
};
```

## Build and Development

### Prerequisites

- Node.js > 20.x (Recommended: 24.12.0)
- npm or yarn

### Environment Variables

Create `.env` file in project root:

```env
VITE_APP_NAME=MTF CRM
VITE_APP_KEY=mtf_crm_client
VITE_API_URL=http://localhost:5000
VITE_ADMIN_CODE=abc123          # Optional: for creating admin accounts
```

### Available Scripts

```bash
# Development
npm run dev                 # Start dev server (port 3000)

# Build
npm run build               # Type check + build for production
npm run preview             # Preview production build

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint issues
npm run prettier            # Check Prettier formatting
npm run prettier:fix        # Fix Prettier formatting
npm run fix                 # Run both lint:fix and prettier:fix
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d --build

# The app will be available at http://localhost:3000
```

The Dockerfile uses a multi-stage build:
1. Stage 1: Build the app with Node.js 20
2. Stage 2: Serve with `serve` package on port 3000

## Code Style Guidelines

### ESLint Configuration

Extends multiple recommended configs:
- `eslint:recommended`
- `plugin:react/recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:prettier/recommended` (integrates Prettier)

Key rules:
- React 17+ JSX transform (no need to import React)
- Unused imports/variables allowed (disabled for dev convenience)
- `any` type allowed
- `console.log` allowed
- Accessibility warnings for alt-text disabled

### Prettier Configuration

```json
{
  "arrowParens": "always",
  "jsxSingleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "useTabs": false,
  "endOfLine": "auto",
  "printWidth": 100,
  "bracketSameLine": false
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useList.tsx`)
- **API files**: camelCase with `.api.ts` suffix (e.g., `product.api.ts`)
- **Types**: PascalCase in `types/` folder
- **SCSS modules**: `styles.module.scss` for component-scoped styles

### Import Aliases

```typescript
// Use @/ alias for src/ directory
import productApi from '@/+core/api/product.api';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
```

Configured in `tsconfig.json` and `vite.config.ts`.

## Key Features and Patterns

### Authentication Flow

1. Login/Register stores session in cookies (key: `mtf_crm_client`)
2. Cookie contains: token, user info, role
3. Axios interceptor adds `Authorization: Bearer <token>` header
4. 401 responses trigger automatic logout via `forceLogout()`
5. Protected routes use `AuthProtectProvider` for role-based access

### Internationalization (i18n)

- Supported languages: English (`en`), Vietnamese (`vi`)
- Default: Vietnamese
- Language auto-detected from browser
- Translations in `src/i18n/locales/[lang]/translation.json`
- Usage: `const { t } = useTranslation();` then `t('key')`

### WebSocket Integration

- Socket.io client for real-time notifications
- Hook: `useSocket.ts` for managing connection
- Notifications for order updates

### Rich Text Editing

- Uses `jodit-react` for admin content editing
- Uses `quill` as alternative rich text editor

### Image Gallery

- `yet-another-react-lightbox` for product image galleries

### Carousel/Slider

- `react-slick` for banners and product carousels
- Requires importing slick CSS files in App.tsx

## Testing Strategy

Currently, this project does not have automated tests configured. When adding tests:

- Use **Vitest** (aligned with Vite ecosystem)
- Use **React Testing Library** for component tests
- Place test files alongside components: `ComponentName.test.tsx` or in `__tests__/` folders

## Security Considerations

1. **Authentication**: JWT tokens stored in httpOnly cookies (handled by backend)
2. **XSS Protection**: React's built-in escaping, avoid `dangerouslySetInnerHTML`
3. **CORS**: Configured at backend (localhost:5000)
4. **Authorization**: Role-based route protection via `AuthProtectProvider`

## Common Development Tasks

### Adding a New Feature Page

1. Create folder in `src/pages/[feature]/`
2. Create subfolders: `components/`, `hooks/`, `pages/`
3. Add API file in `src/+core/api/[feature].api.ts`
4. Add types in `src/types/[feature].ts`
5. Add routes in appropriate router file
6. Update navigation in Sidebar if needed

### Adding a New API Endpoint

```typescript
// In src/+core/api/feature.api.ts
import axiosInstance from './api.instance';

const featureApi = {
  getList: (params?: any) => axiosInstance.get('/feature', { params }),
  getById: (id: string) => axiosInstance.get(`/feature/${id}`),
  create: (data: CreatePayload) => axiosInstance.post('/feature', data),
  update: (id: string, data: UpdatePayload) => axiosInstance.patch(`/feature/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/feature/${id}`),
};

export default featureApi;
```

### Adding Translations

1. Add key to both `src/i18n/locales/en/translation.json` and `vi/translation.json`
2. Use in component: `const { t } = useTranslation(); t('your.key')`

## Troubleshooting

### Package Installation Issues

If you encounter peer dependency conflicts:
```bash
npm install --force
# or
npm install --legacy-peer-deps
```

### Port Already in Use

Vite dev server runs on port 3000. Change in `vite.config.ts`:
```typescript
server: {
  port: 3001,
}
```

### Build Errors

Ensure TypeScript types are up to date:
```bash
npm run build
# Check for type errors before build completes
```

## Resources

- [React Documentation](https://react.dev)
- [Ant Design Components](https://ant.design/components)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Configuration](https://vitejs.dev/config/)
