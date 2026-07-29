# GearUp API Integration Documentation

## Frontend Component → API Endpoint → Purpose

---

### Authentication

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `LoginPage` (`(auth)/login/page.tsx`) | `POST /api/auth/login` | Authenticate user with email/password |
| `RegisterPage` (`(auth)/register/page.tsx`) | `POST /api/users/register` | Create new user account |
| `AuthContext` (`context/AuthContext.tsx`) | `GET /api/users/me` | Fetch current authenticated user profile |
| `AuthContext` (`context/AuthContext.tsx`) | `POST /api/auth/logout` | Clear authentication session |
| `AuthContext` (`context/AuthContext.tsx`) | `POST /api/auth/refresh-token` | Refresh JWT access token |
| `ProfilePage` (`dashboard/*/profile/page.tsx`) | `PATCH /api/auth/change-password` | Change user password |
| `ProfilePage` (`dashboard/*/profile/page.tsx`) | `PUT /api/users/my-profile` | Update user name/phone |

---

### Public Pages

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `HomePage` (`page.tsx`) | `GET /api/gears` | Display featured gears on landing page |
| `GearListingPage` (`(public)/gear/page.tsx`) | `GET /api/gears` | Browse/search/filter available gears |
| `GearListingPage` (`(public)/gear/page.tsx`) | `GET /api/categories` | Load category filter options |
| `GearDetailsPage` (`(public)/gear/[id]/page.tsx`) | `GET /api/gears/:id` | Load single gear details |
| `GearDetailsPage` (`(public)/gear/[id]/page.tsx`) | `GET /api/reviews/gear/:gearId` | Load reviews for a gear |

---

### Customer Dashboard

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `CustomerDashboardPage` (`dashboard/customer/page.tsx`) | `GET /api/dashboard/customer` | Load customer dashboard stats |
| `MyRentalsPage` (`dashboard/customer/rentals/page.tsx`) | `GET /api/rentals/my-rentals` | Load customer rental history |
| `MyRentalsPage` (`dashboard/customer/rentals/page.tsx`) | `POST /api/payments/checkout/:rentalId` | Initiate Stripe checkout payment |
| `MyReviewsPage` (`dashboard/customer/reviews/page.tsx`) | `GET /api/reviews/my-reviews` | Load customer's reviews |
| `MyReviewsPage` (`dashboard/customer/reviews/page.tsx`) | `PATCH /api/reviews/:id` | Update a review |
| `MyReviewsPage` (`dashboard/customer/reviews/page.tsx`) | `DELETE /api/reviews/:id` | Delete a review |
| `ProfilePage` (`dashboard/customer/profile/page.tsx`) | `PUT /api/users/my-profile` | Update profile information |
| `ProfilePage` (`dashboard/customer/profile/page.tsx`) | `PATCH /api/auth/change-password` | Change password |
| `GearDetailsPage` (`(public)/gear/[id]/page.tsx`) | `POST /api/rentals` | Create a new rental booking |

---

### Provider Dashboard

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `ProviderDashboardPage` (`dashboard/provider/page.tsx`) | `GET /api/dashboard/provider` | Load provider dashboard stats |
| `InventoryPage` (`dashboard/provider/inventory/page.tsx`) | `GET /api/gears/my-gears` | Load provider's gear inventory |
| `AddGearPage` (`dashboard/provider/inventory/new/page.tsx`) | `POST /api/gears` | Add new gear listing |
| `EditGearPage` (`dashboard/provider/inventory/[id]/edit/page.tsx`) | `PATCH /api/gears/:id` | Update gear listing |
| `InventoryPage` (`dashboard/provider/inventory/page.tsx`) | `DELETE /api/gears/:id` | Delete gear listing |
| `ProviderOrdersPage` (`dashboard/provider/orders/page.tsx`) | `GET /api/rentals/provider-orders` | Load provider's rental orders |
| `ProviderOrdersPage` (`dashboard/provider/orders/page.tsx`) | `PATCH /api/rentals/:id/confirm` | Confirm a rental order |
| `ProviderOrdersPage` (`dashboard/provider/orders/page.tsx`) | `PATCH /api/rentals/:id/pickup` | Mark rental as picked up |
| `ProviderOrdersPage` (`dashboard/provider/orders/page.tsx`) | `PATCH /api/rentals/:id/return` | Mark rental as returned |
| `ProviderOrdersPage` (`dashboard/provider/orders/page.tsx`) | `PATCH /api/rentals/:id/cancel` | Cancel a rental order |
| `EditGearPage/AddGearPage` | `GET /api/categories` | Load categories for form select |

---

### Admin Dashboard

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `AdminDashboardPage` (`dashboard/admin/page.tsx`) | `GET /api/admin/dashboard` | Load admin dashboard stats |
| `AdminUsersPage` (`dashboard/admin/users/page.tsx`) | `GET /api/admin/users` | Load all users with pagination |
| `AdminUsersPage` (`dashboard/admin/users/page.tsx`) | `PATCH /api/admin/users/:id/suspend` | Suspend a user |
| `AdminUsersPage` (`dashboard/admin/users/page.tsx`) | `PATCH /api/admin/users/:id/activate` | Activate a suspended user |
| `AdminUsersPage` (`dashboard/admin/users/page.tsx`) | `PATCH /api/admin/users/:id/role` | Change user role |
| `AdminRentalsPage` (`dashboard/admin/rentals/page.tsx`) | `GET /api/admin/rentals` | Load all platform rentals |
| `AdminRentalsPage` (`dashboard/admin/rentals/page.tsx`) | `PATCH /api/rentals/:id/cancel` | Cancel any rental |
| `AdminPaymentsPage` (`dashboard/admin/payments/page.tsx`) | `GET /api/admin/payments` | Load all payment transactions |

---

### Payment Flow

| Frontend Component | API Endpoint | Purpose |
|-------------------|-------------|---------|
| `MyRentalsPage` (`dashboard/customer/rentals/page.tsx`) | `POST /api/payments/checkout/:rentalId` | Create Stripe Checkout session |
| `PaymentSuccessPage` (`payment/success/page.tsx`) | — | Handle successful Stripe redirect |
| `PaymentCancelPage` (`payment/cancel/page.tsx`) | — | Handle cancelled Stripe redirect |

---

### Services Layer Architecture

```
Component/Page
  ↓ (useQuery / useMutation)
Service Function
  ↓ (apiFetch / fetchData)
Backend API (https://gearup-backend-b7a4.onrender.com/api)
```

All API calls use `credentials: "include"` for cookie-based authentication.
Responses follow the `ApiResponse<T>` format: `{ success, statusCode, message, data }`.
