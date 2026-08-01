# 🏋️ GearUp - Sports & Outdoor Gear Rental Platform

GearUp is a full-stack Sports & Outdoor Gear Rental Platform built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. It enables customers to rent sports equipment, providers to manage inventory, and administrators to oversee the entire platform through role-based dashboards.

---

# 🌐 Live Demo

## 🚀 Frontend
https://gear-up-frontend-b7-a5.vercel.app

## ⚙️ Backend API
https://gearup-backend-b7a4.onrender.com

---

# 🎥 Video Explanation

> **Demo Video:**  
> *https://drive.google.com/file/d/1kyZACJthg4hZlQ-kyNz9QBrRNdszE22r/view?usp=drivesdk*

---

# 👨‍💼 Admin Credentials

| Email | Password |
|--------|----------|
| **admin@gmail.com** | **admin123** |

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication (httpOnly Cookie + localStorage)
- Login & Registration
- Role-based Authorization
- Protected Routes via Next.js Middleware
- Automatic Access Token Refresh (401 retry)
- Change Password
- Profile Management (name, phone, profile image)

## 🌍 Public Features

- Featured Gear Homepage
- Gear Listing with Search
- Category Filtering
- Price Range Filtering
- Sorting (price, date, name)
- Pagination
- Gear Details Page
- Category Browser
- Reviews on Gear Details
- Responsive UI

## 👤 Customer Features

- Customer Dashboard (stats: orders, active, returned, cancelled, spent)
- Rental History with Status Filtering
- Rental Status Tracking (PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED)
- Cancel Orders
- Stripe Checkout Integration
- Payment Success & Cancel Pages
- Review Management (create, delete)
- Profile Update (name, phone, profile image)
- Change Password

## 🏪 Provider Features

- Provider Dashboard (stats: gear, rentals, orders, revenue)
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

## 🛡️ Admin Features

- Admin Dashboard (platform-wide statistics)
- User Management (list, search, filter by role/status)
- Suspend / Activate Users
- Change User Role
- Gear Management (view all, toggle availability, delete)
- Rental Management (view all with status/payment filtering)
- Payment Monitoring
- Category CRUD (create, edit, delete)
- Review Management (view all, delete)

---

# 🛠️ Tech Stack

## 🎨 Frontend

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v3**
- **Base UI** (@base-ui/react)
- **TanStack Query** (data fetching & caching)
- **React Hook Form** + **Zod** (form validation)
- **Zustand** (auth state management)
- **react-hot-toast** (toast notifications)
- **Stripe** (payment integration)
- **Lucide React** (icons)
- **date-fns** (date formatting)
- **Gravatar** (profile avatars)
- **jose** (JWT parsing)
- **class-variance-authority** + **tailwind-merge** (component styling)

## ⚙️ Backend

- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Stripe Payment
- Image Upload

---

# 📁 Project Structure

```text
src/
├── actions/              # Server actions (getAccessToken, removeAccessToken)
├── app/                  # Next.js App Router pages & layouts
│   ├── auth/             # Login, Register, Forgot Password
│   ├── categories/       # Category browser
│   ├── dashboard/        # Role-based dashboards
│   │   ├── admin/        # Users, Gears, Rentals, Payments, Categories, Reviews
│   │   ├── customer/     # Orders (with payment), Reviews
│   │   ├── provider/     # Gear (CRUD), Orders, Reviews
│   │   └── profile/      # Profile & password management
│   ├── gear/             # Gear listing & details
│   ├── payment/          # Payment success & cancel pages
│   ├── payment-success/  # Stripe success callback
│   ├── payment-cancel/   # Stripe cancel callback
│   ├── layout.tsx        # Root layout (Navbar, Footer)
│   ├── page.tsx          # Home page (Hero, Features, Categories, Featured Gear)
│   └── providers.tsx     # TanStack Query + Auth Initializer + Toaster
├── components/
│   ├── layout/           # Navbar, Footer, Dashboard Sidebar
│   ├── shared/           # Container, LoadingSpinner, ErrorState, EmptyState
│   └── ui/               # Button, Card, Input, Badge, Select, Skeleton, RefreshButton
├── constants/            # BASE_URL, USER_ROLE enum, ROUTES
├── context/              # AuthContext (login, register, logout, refreshUser, etc.)
├── hooks/                # useAuth, useGear, useRental, useInitializeAuth
├── lib/                  # api client, auth helpers, fetch wrapper, utils, gravatar, queryCache
├── providers/            # QueryProvider
├── schemas/              # Zod schemas (login, register, gear, rental, review, profile, change-password)
├── services/             # API service layer (auth, gear, rental, category, user, payment, review, dashboard, admin)
├── store/                # Zustand auth store
├── types/                # TypeScript interfaces (IUser, IGearItem, IRentalOrder, IPayment, IReview, etc.)
├── utils/                # Price & date formatting utilities
└── middleware.ts         # Route protection based on JWT role
```

---

# ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-b7a4.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

---

# 🚀 Getting Started

## 📦 Install Dependencies

```bash
npm install
```

## ▶️ Run Development Server

```bash
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

## 🚀 Start Production Server

```bash
npm start
```

---

# 💳 Payment

GearUp uses **Stripe Checkout** for secure online payments.

**Stripe Test Card:**

```text
Card Number : 4242 4242 4242 4242
Expiry Date : Any future date
CVV         : Any 3 digits
ZIP Code    : Any valid ZIP
```

---

# 🔒 Role-Based Routing

| Role | Dashboard | Prefix |
|------|-----------|--------|
| Customer | `/dashboard/customer` | Orders, Reviews |
| Provider | `/dashboard/provider` | Gear, Orders, Reviews |
| Admin | `/dashboard/admin` | Users, Gears, Rentals, Payments, Categories, Reviews |

Next.js Middleware protects all private routes based on the authenticated user's role parsed from the JWT access token cookie.

---

# 📚 API Documentation

See [API_INTEGRATION.md](./API_INTEGRATION.md) for complete frontend ↔ backend endpoint mapping.

---

# 🔗 Backend

- **Repository**: https://github.com/mesbahtoha/GearUp-Backend-B7A4
- **Live API**: https://gearup-backend-b7a4.onrender.com

---

# ☁️ Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL

---

# 👨‍💻 Author

**Md. Mesbahul Alam**
