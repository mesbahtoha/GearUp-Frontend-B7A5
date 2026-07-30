# GearUp - Sports & Outdoor Gear Rental Platform

Rent sports & outdoor gear instantly. GearUp connects customers with equipment providers for seamless gear rental.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (base-ui components)
- **TanStack Query** (data fetching)
- **React Hook Form + Zod** (form validation)
- **Sonner** (toast notifications)
- **Stripe** (payment integration)

## Admin Credentials

- **Email:** admin@gmail.com
- **Password:** admin123

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-b7a4.onrender.com/api
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Start production server

```bash
npm start
```

## Project Structure

```
src/
├── actions/          # Server actions
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login, Register
│   ├── (public)/     # Home, Gear listing, Gear details
│   ├── dashboard/    # Customer, Provider, Admin dashboards
│   └── payment/      # Success & Cancel pages
├── components/
│   ├── layouts/      # Navbar, Footer, DashboardSidebar
│   ├── modules/      # Feature-specific components
│   ├── shared/       # Container, Loading, Empty, Error states
│   └── ui/           # shadcn/ui components
├── constants/        # Routes, Roles
├── context/          # AuthContext
├── hooks/            # Custom hooks
├── lib/              # Utilities, fetch wrapper
├── providers/        # React providers (Query, Auth)
├── schemas/          # Zod validation schemas
├── services/         # API service layer
├── types/            # TypeScript types
└── middleware.ts     # Route protection
```

## Features

### Public
- Home page with featured gears
- Gear listing with search, category filter, price filter
- Gear details with image gallery and rental form

### Customer
- Dashboard with stats
- Rental history with payment
- Review management
- Profile management
- Stripe checkout integration

### Provider
- Dashboard with stats
- Inventory management (CRUD)
- Order management (confirm, pickup, return, cancel)
- Profile management

### Admin
- Dashboard with platform stats
- User management (suspend, activate, role change)
- Rental management
- Payment management

## API Documentation

See [API_INTEGRATION.md](./API_INTEGRATION.md) for complete API endpoint mapping.

## Backend

Backend repository: GearUp - Backend
Live API: https://gearup-backend-b7a4.onrender.com/api
