# 🚀 GearUp - Sports & Outdoor Gear Rental Platform

GearUp is a modern full-stack Sports & Outdoor Gear Rental Platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. It enables customers to rent sports equipment, providers to manage inventory, and administrators to oversee the entire platform through role-based dashboards.

---

# 🌐 Live Demo

### Frontend
https://gear-up-frontend-b7-a5.vercel.app

### Backend API
https://gearup-backend-b7a4.onrender.com

---

# 🎥 Video Explanation

> Video link will be added after recording.

---

# 👨‍💻 Admin Credentials

| Email | Password |
|--------|----------|
| **admin@gmail.com** | **admin123** |

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication (httpOnly Cookies)
- Login & Registration
- Role-based Authorization
- Protected Routes using Next.js Middleware
- Automatic Access Token Refresh
- Change Password
- Profile Management

---

## 🌍 Public Features

- Featured Gear Homepage
- Gear Listing
- Search
- Category Filtering
- Availability Filtering
- Price Filtering
- Pagination
- Gear Details
- Provider Information
- Responsive UI

---

## 👤 Customer Features

- Customer Dashboard
- Rental History
- Rental Status Tracking
- Stripe Checkout Integration
- Payment Success & Cancel Pages
- Review Management
- Profile Update
- Change Password

---

## 🏪 Provider Features

- Provider Dashboard
- Gear CRUD
- Inventory Management
- Rental Order Management
- Confirm Orders
- Mark Picked Up
- Mark Returned
- Profile Management

---

## 🛡 Admin Features

- Admin Dashboard
- Platform Statistics
- User Management
- Suspend / Activate Users
- Change User Role
- Rental Management
- Payment Monitoring

---

# 🛠 Tech Stack

## Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Base UI (shadcn/ui)
- TanStack Query
- React Hook Form
- Zod
- Sonner

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Stripe

---

# 📦 Project Structure

```text
src/
├── actions/
├── app/
│   ├── (auth)
│   ├── (public)
│   ├── dashboard
│   └── payment
├── components/
├── constants/
├── context/
├── hooks/
├── providers/
├── schemas/
├── services/
├── types/
└── middleware.ts
```

---

# ⚙️ Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=https://gearup-backend-b7a4.onrender.com
```

---

# 🚀 Getting Started

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start Production

```bash
npm start
```

---

# 💳 Payment

GearUp uses **Stripe Checkout** for secure online payments.

Stripe Test Card:

```text
Card Number : 4242 4242 4242 4242
Expiry Date : Any future date
CVV         : Any 3 digits
ZIP Code    : Any valid ZIP
```

---

# 📚 API Documentation

See:

```
API_INTEGRATION.md
```

for complete frontend ↔ backend endpoint mapping.

---

# 🌐 Backend

Repository:

https://github.com/mesbahtoha/GearUp-Backend-B7A4

API:

https://gearup-backend-b7a4.onrender.com

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Render

Database

- Neon PostgreSQL

---

# 📋 Assignment Checklist

✅ Next.js App Router

✅ TypeScript

✅ Tailwind CSS v4

✅ Base UI Components

✅ TanStack Query

✅ React Hook Form + Zod

✅ JWT Authentication

✅ Role-based Middleware

✅ Stripe Payment Integration

✅ Responsive Design

✅ Dashboard for Customer, Provider & Admin

✅ CRUD Operations

✅ Search, Filter & Pagination

✅ Profile Management

✅ Toast Notifications

✅ Loading Skeletons

✅ Error Handling

---

# 👨‍💻 Author

**Md. Mesbahul Alam**
