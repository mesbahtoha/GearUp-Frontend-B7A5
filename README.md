# GearUp - Sports & Outdoor Gear Rental Platform

GearUp is a full-stack Sports & Outdoor Gear Rental Platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. It enables customers to rent sports equipment, providers to manage inventory, and administrators to oversee the entire platform through role-based dashboards.

---

## Live Deployments

### Frontend
https://gear-up-frontend-b7-a5.vercel.app

### Backend API
https://gearup-backend-b7a4.onrender.com

---

## Authentication

Authentication is limited to **registered users only**:

- **Register** an account (Customer or Provider) with name, email, and password
- **Sign in** with your registered email & password
- **Sign in** with **Google OAuth**
- No demo accounts, no demo login buttons

Newly registered customers can use the platform right away. Providers must register with the Provider role. Admin access is provisioned by the platform owner via the database seed (see the Backend README).

---

## Features

### Authentication
- JWT Authentication (httpOnly Cookie + localStorage)
- Register & Login with email/password
- **Social Login (Google OAuth)**
- Role-based Authorization
- Protected Routes via Next.js Middleware
- Automatic Access Token Refresh (401 retry)
- Forgot / Change Password
- Profile Management (name, phone, profile image)

### Public Features
- Hero Slider Homepage
- Featured Gear, Categories, Statistics, Testimonials & FAQ sections
- Newsletter Signup Form
- Gear Listing with Search, Category & Price Filtering, Sorting, Pagination
- Gear Details Page with Related Gear, Rating Summary & Reviews
- Category Browser
- Static pages: **About, Contact, Blog, Help, Privacy, Terms**
- **Dark Mode** (theme toggle, persists across sessions)
- Responsive UI

### Customer Features
- Customer Dashboard (stats: orders, active, returned, cancelled, spent) + **order status chart**
- Rental History with Status Filtering
- Rental Status Tracking (PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED)
- Cancel Orders
- Stripe Checkout Integration
- Payment Success & Cancel Pages
- Review Management (create, delete)
- Profile Update (name, phone, profile image)
- Change Password

### Provider Features
- Provider Dashboard (stats: gear, rentals, orders, revenue) + **order status chart**
- Gear CRUD (create, read, update, delete)
- Image Upload for Gear
- Availability Toggle
- Category Selection
- Rental Order Management
- Confirm Orders (PLACED → CONFIRMED)
- Mark Picked Up (PAID → PICKED_UP)
- Mark Returned (PICKED_UP → RETURNED)
- Cancel Orders
- Review Visibility
- Profile Management

### Admin Features
- Admin Dashboard (platform-wide statistics) + **analytics charts** (monthly revenue, rentals per month, rentals by status, gear by category)
- User Management (list, search, filter by role/status)
- Suspend / Activate Users
- Change User Role
- Gear Management (view all, toggle availability, delete)
- Rental Management (view all with status/payment filtering)
- Payment Monitoring
- Category CRUD (create, edit, delete)
- Review Management (view all, delete)

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v3**
- **Base UI** (@base-ui/react)
- **TanStack Query** (data fetching & caching)
- **React Hook Form** + **Zod** (form validation)
- **Zustand** (auth state management)
- **next-themes** (dark mode)
- **Recharts** (dashboard charts)
- **react-hot-toast** (toast notifications)
- **Stripe** (payment integration)
- **Lucide React** (icons)
- **date-fns** (date formatting)
- **Gravatar** (profile avatars)
- **jose** (JWT parsing)
- **class-variance-authority** + **tailwind-merge** (component styling)

---

## Project Structure

```text
src/
├── actions/              # Server actions (getAccessToken, removeAccessToken)
├── app/                  # Next.js App Router pages & layouts
│   ├── auth/             # Login, Register, Forgot Password
│   ├── about/            # About page
│   ├── blog/             # Blog listing & post details
│   ├── categories/       # Category browser
│   ├── contact/          # Contact page (form)
│   ├── dashboard/        # Role-based dashboards
│   │   ├── admin/        # Users, Gears, Rentals, Payments, Categories, Reviews
│   │   ├── customer/     # Orders (with payment), Reviews
│   │   ├── provider/     # Gear (CRUD), Orders, Reviews
│   │   └── profile/      # Profile & password management
│   ├── gear/             # Gear listing & details
│   ├── help/             # Help/FAQ page
│   ├── privacy/          # Privacy policy
│   ├── terms/            # Terms of service
│   ├── payment/          # Payment success & cancel pages
│   ├── layout.tsx        # Root layout (Navbar, Footer, ThemeProvider)
│   └── page.tsx          # Home page (Hero slider, Features, Stats, FAQ, Newsletter)
├── components/
│   ├── layout/           # Navbar, Footer, Dashboard Sidebar
│   ├── shared/           # Container, LoadingSpinner, ErrorState, EmptyState, Charts
│   └── ui/               # Button, Card, Input, Badge, Select, Textarea, Skeleton, ThemeToggle
├── constants/            # BASE_URL, USER_ROLE enum, ROUTES, blog posts
├── context/              # AuthContext (login, register, logout, refreshUser, etc.)
├── hooks/                # useAuth, useGear, useRental, useInitializeAuth
├── lib/                  # api client, auth helpers, fetch wrapper, utils, gravatar, queryCache
├── providers/            # QueryProvider, ThemeProvider
├── schemas/              # Zod schemas (login, register, gear, rental, review, profile, change-password)
├── services/             # API service layer (auth, gear, rental, category, user, payment, review, dashboard, admin)
├── store/                # Zustand auth store
├── types/                # TypeScript interfaces (IUser, IGearItem, IRentalOrder, IPayment, IReview, etc.)
├── utils/                # Price & date formatting utilities
└── middleware.ts         # Route protection based on JWT role
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-b7a4.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Author

**Md. Mesbahul Alam**
