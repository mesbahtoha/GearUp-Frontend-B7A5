# 🏋️ GearUp — Sports & Outdoor Gear Rental Platform

**GearUp** is a full-stack Sports & Outdoor Gear Rental Platform that allows customers to rent sports equipment, providers to manage their inventory and rental orders, and administrators to manage the entire platform through dedicated role-based dashboards.

Built with **Next.js 15, React 19, TypeScript, Tailwind CSS, Node.js, Express.js, Prisma, PostgreSQL, and Stripe**.

---

## 🌐 Live Demo

### 🚀 Frontend

https://gear-up-frontend-b7-a5.vercel.app

### ⚙️ Backend API

https://gearup-backend-b7a4.onrender.com

---

## 🎥 Demo Video

**Video Explanation:**
https://drive.google.com/file/d/1kyZACJthg4hZlQ-kyNz9QBrRNdszE22r/view?usp=drivesdk

---

## 👨‍💼 Admin Credentials

Use the following credentials to explore the Admin Dashboard:

| Email             | Password   |
| ----------------- | ---------- |
| `admin@gmail.com` | `admin123` |

> ⚠️ These credentials are provided for demonstration and testing purposes.

---

# ✨ Features

## 🔐 Authentication & Authorization

* JWT-based authentication
* HTTP-only cookie & localStorage token handling
* Login & registration
* Role-based authorization
* Protected routes with Next.js Middleware
* Automatic access-token refresh on `401` responses
* Logout
* Change password
* Profile management
* Profile image support

---

## 🌍 Public Features

* Modern landing page
* Featured gear section
* Browse all available gears
* Search gears
* Category filtering
* Price range filtering
* Sorting by:

  * Price
  * Date
  * Name
* Pagination
* Gear details page
* Category browser
* Gear reviews
* Fully responsive UI

---

## 👤 Customer Features

Customers can:

* View personalized dashboard
* View rental statistics
* Browse and rent equipment
* View rental history
* Filter rentals by status
* Track rental status
* Cancel rental orders
* Complete Stripe Checkout payments
* View payment success/cancel pages
* Create reviews
* Delete reviews
* Update profile information
* Change password

### Rental Status Flow

```text
PLACED
   ↓
CONFIRMED
   ↓
PAID
   ↓
PICKED_UP
   ↓
RETURNED
```

---

## 🏪 Provider Features

Providers can:

* View provider dashboard
* Monitor gear statistics
* Track rental orders
* Monitor revenue
* Create gears
* Update gears
* Delete gears
* Upload gear images
* Toggle gear availability
* Select gear categories
* Manage rental orders
* Confirm rental orders
* Mark equipment as picked up
* Mark equipment as returned
* Cancel orders
* View customer reviews
* Manage profile

### Provider Order Flow

```text
PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
```

---

## 🛡️ Admin Features

Administrators have platform-wide management capabilities.

### Dashboard

* Platform statistics
* User statistics
* Rental statistics
* Revenue/payment information

### User Management

* View all users
* Search users
* Filter by role
* Filter by account status
* Suspend users
* Activate users
* Change user roles

### Gear Management

* View all gears
* Monitor gear availability
* Toggle availability
* Delete gears

### Rental Management

* View all rentals
* Filter by rental status
* Filter by payment status

### Payment Management

* Monitor platform payments
* View payment information

### Category Management

* Create categories
* Update categories
* Delete categories

### Review Management

* View all reviews
* Delete reviews

---

# 🛠️ Tech Stack

## 🎨 Frontend

| Technology                   | Purpose                         |
| ---------------------------- | ------------------------------- |
| **Next.js 15**               | React framework & App Router    |
| **React 19**                 | UI development                  |
| **TypeScript**               | Type safety                     |
| **Tailwind CSS v3**          | Styling                         |
| **Base UI**                  | UI primitives                   |
| **TanStack Query**           | Data fetching & caching         |
| **React Hook Form**          | Form management                 |
| **Zod**                      | Form/schema validation          |
| **Zustand**                  | Authentication state management |
| **Stripe**                   | Payment integration             |
| **Lucide React**             | Icons                           |
| **React Hot Toast**          | Notifications                   |
| **date-fns**                 | Date formatting                 |
| **Gravatar**                 | Profile avatars                 |
| **jose**                     | JWT parsing                     |
| **class-variance-authority** | Component variants              |
| **tailwind-merge**           | Tailwind class merging          |

## ⚙️ Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* NeonDB
* JWT Authentication
* Stripe
* Image Upload

---

# 🏗️ Architecture

GearUp follows a modular full-stack architecture:

```text
┌─────────────────────────────┐
│        Next.js Frontend     │
│                             │
│  App Router + React + TS    │
│  TanStack Query + Zustand   │
│  React Hook Form + Zod      │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│  JWT + Role Authorization   │
│  Business Logic             │
│  Stripe Integration         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Prisma ORM            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     PostgreSQL / NeonDB     │
└─────────────────────────────┘
```

---

# 📁 Project Structure

```text
src/
├── actions/
│   ├── getAccessToken
│   └── removeAccessToken
│
├── app/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── categories/
│   │
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── gears/
│   │   │   ├── rentals/
│   │   │   ├── payments/
│   │   │   ├── categories/
│   │   │   └── reviews/
│   │   │
│   │   ├── customer/
│   │   │   ├── orders/
│   │   │   └── reviews/
│   │   │
│   │   ├── provider/
│   │   │   ├── gear/
│   │   │   ├── orders/
│   │   │   └── reviews/
│   │   │
│   │   └── profile/
│   │
│   ├── gear/
│   │   ├── listing/
│   │   └── [id]/
│   │
│   ├── payment/
│   ├── payment-success/
│   ├── payment-cancel/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar
│   │   ├── Footer
│   │   └── DashboardSidebar
│   │
│   ├── shared/
│   │   ├── Container
│   │   ├── LoadingSpinner
│   │   ├── ErrorState
│   │   └── EmptyState
│   │
│   └── ui/
│       ├── Button
│       ├── Card
│       ├── Input
│       ├── Badge
│       ├── Select
│       ├── Skeleton
│       └── RefreshButton
│
├── constants/
│   ├── BASE_URL
│   ├── USER_ROLE
│   └── ROUTES
│
├── context/
│   └── AuthContext
│
├── hooks/
│   ├── useAuth
│   ├── useGear
│   ├── useRental
│   └── useInitializeAuth
│
├── lib/
│   ├── api
│   ├── auth
│   ├── fetch
│   ├── utils
│   ├── gravatar
│   └── queryCache
│
├── providers/
│   └── QueryProvider
│
├── schemas/
│   ├── login
│   ├── register
│   ├── gear
│   ├── rental
│   ├── review
│   ├── profile
│   └── change-password
│
├── services/
│   ├── auth
│   ├── gear
│   ├── rental
│   ├── category
│   ├── user
│   ├── payment
│   ├── review
│   ├── dashboard
│   └── admin
│
├── store/
│   └── authStore
│
├── types/
│   ├── IUser
│   ├── IGearItem
│   ├── IRentalOrder
│   ├── IPayment
│   └── IReview
│
├── utils/
│   ├── price
│   └── date
│
└── middleware.ts
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-b7a4.onrender.com

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

> Never commit `.env.local` or any secret credentials to GitHub.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/mesbahtoha/GearUp-Frontend-B7A5.git

cd GearUp-Frontend-B7A5
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create `.env.local` and add the required environment variables.

## 4. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 💳 Stripe Payment

GearUp uses **Stripe Checkout** for secure online payments.

### Stripe Test Card

```text
Card Number : 4242 4242 4242 4242
Expiry Date : Any future date
CVV         : Any 3 digits
ZIP Code    : Any valid ZIP
```

Use Stripe test mode credentials when testing payments.

---

# 🔒 Role-Based Routing

GearUp uses **Next.js Middleware** to protect private routes based on the authenticated user's role.

| Role     | Dashboard             | Access                                               |
| -------- | --------------------- | ---------------------------------------------------- |
| Customer | `/dashboard/customer` | Orders, Reviews                                      |
| Provider | `/dashboard/provider` | Gear, Orders, Reviews                                |
| Admin    | `/dashboard/admin`    | Users, Gears, Rentals, Payments, Categories, Reviews |

The middleware parses the JWT access token and prevents unauthorized users from accessing role-specific routes.

---

# 🔄 Authentication Flow

```text
User Login
    ↓
Backend validates credentials
    ↓
Access Token + Refresh Token
    ↓
Token stored securely
    ↓
Protected API Request
    ↓
Access Token Expired?
    ├── No → Continue Request
    │
    └── Yes → Refresh Token
                 ↓
            New Access Token
                 ↓
            Retry Request
```

---

# 📚 API Documentation

For complete frontend ↔ backend API endpoint mapping, see:

**[API_INTEGRATION.md](https://github.com/mesbahtoha/GearUp-Frontend-B7A5/blob/4612b24405902c246d6a0f1792d8579052409b1b/API_INTEGRATION.md)**

---

# 🔗 Backend

### Repository

https://github.com/mesbahtoha/GearUp-Backend-B7A4

### Live API

https://gearup-backend-b7a4.onrender.com

---

# ☁️ Deployment

| Service  | Platform        |
| -------- | --------------- |
| Frontend | Vercel          |
| Backend  | Render          |
| Database | Neon PostgreSQL |
| Payment  | Stripe          |

---

# 📌 Related Repository

**GearUp Backend API:**
https://github.com/mesbahtoha/GearUp-Backend-B7A4

---

# 👨‍💻 Author

## Md. Mesbahul Alam (Toha)

**Full Stack Developer**

Building scalable web applications with modern technologies and AI-powered solutions.

---

## ⭐ Support

If you find this project useful, please consider giving the repository a ⭐ on GitHub.

---

### 🏋️ GearUp

**Rent Sports & Outdoor Gear Instantly.**
