# GearUp API Integration Documentation

## Frontend Component → API Endpoint → Purpose

---

### Authentication

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `LoginPage` | `/api/auth/login` | POST | Authenticate user, sets httpOnly JWT cookies |
| `RegisterPage` | `/api/users/register` | POST | Create new user account |
| `AuthContext` | `/api/users/me` | GET | Fetch current authenticated user profile |
| `AuthContext` | `/api/auth/logout` | POST | Clear httpOnly JWT cookies |
| `AuthContext` | `/api/auth/refresh-token` | POST | Refresh JWT access token via refreshToken cookie |
| `ProfilePage` | `/api/auth/change-password` | PATCH | Change user password (old + new) |
| `ProfilePage` | `/api/users/my-profile` | PUT | Update user name/phone |

### Public Pages

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `HomePage` | `/api/gears?limit=6` | GET | Display featured gears on landing page |
| `GearListingPage` | `/api/gears` | GET | Browse/search/filter gears (paginated) |
| `GearListingPage` | `/api/categories` | GET | Load category filter options |
| `GearDetailsPage` | `/api/gears/:id` | GET | Load single gear with category + provider |
| `GearDetailsPage` | `/api/reviews/gear/:gearId` | GET | Load reviews for a gear |

### Customer Dashboard

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `CustomerDashboardPage` | `/api/dashboard/customer` | GET | Load customer stats (totalOrders, activeOrders, totalSpent) |
| `MyRentalsPage` | `/api/rentals/my-rentals` | GET | Load paginated customer rental history |
| `MyRentalsPage` | `/api/payments/checkout/:rentalId` | POST | Create Stripe Checkout session, returns checkoutUrl |
| `MyReviewsPage` | `/api/reviews/my-reviews` | GET | Load customer's reviews with gear info |
| `MyReviewsPage` | `/api/reviews/:id` | PATCH | Update a review (rating/comment) |
| `MyReviewsPage` | `/api/reviews/:id` | DELETE | Delete a review |
| `ProfilePage` | `/api/users/my-profile` | PUT | Update name/phone |
| `ProfilePage` | `/api/auth/change-password` | PATCH | Change password |
| `GearDetailsPage` | `/api/rentals` | POST | Create rental (gearId, quantity, startDate, endDate) |

### Provider Dashboard

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `ProviderDashboardPage` | `/api/dashboard/provider` | GET | Load provider stats (totalGear, totalRentals, totalRevenue) |
| `InventoryPage` | `/api/gears/my-gears` | GET | Load provider's gear inventory |
| `AddGearPage` | `/api/gears` | POST | Create gear (name, description, brand, pricePerDay, stock, categoryId) |
| `EditGearPage` | `/api/gears/:id` | PATCH | Update gear fields |
| `InventoryPage` | `/api/gears/:id` | DELETE | Delete gear listing |
| `ProviderOrdersPage` | `/api/rentals/provider-orders` | GET | Load paginated provider's rental orders |
| `ProviderOrdersPage` | `/api/rentals/:id/confirm` | PATCH | Confirm rental (PLACED → CONFIRMED) |
| `ProviderOrdersPage` | `/api/rentals/:id/pickup` | PATCH | Mark rental as picked up (PAID → PICKED_UP) |
| `ProviderOrdersPage` | `/api/rentals/:id/return` | PATCH | Mark rental as returned (PICKED_UP → RETURNED) |
| `ProviderOrdersPage` | `/api/rentals/:id/cancel` | PATCH | Cancel rental (PLACED only) |
| `AddGearPage`/`EditGearPage` | `/api/categories` | GET | Load categories for dropdown |

### Admin Dashboard

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `AdminDashboardPage` | `/api/admin/dashboard` | GET | Load platform stats (users, gears, rentals, revenue) |
| `AdminUsersPage` | `/api/admin/users` | GET | Load paginated users with search/role/status filter |
| `AdminUsersPage` | `/api/admin/users/:id/suspend` | PATCH | Suspend a user |
| `AdminUsersPage` | `/api/admin/users/:id/activate` | PATCH | Activate a suspended user |
| `AdminUsersPage` | `/api/admin/users/:id/role` | PATCH | Change user role |
| `AdminRentalsPage` | `/api/admin/rentals` | GET | Load all platform rentals (paginated) |
| `AdminRentalsPage` | `/api/rentals/:id/cancel` | PATCH | Cancel any rental |
| `AdminPaymentsPage` | `/api/admin/payments` | GET | Load all payment transactions (paginated) |

### Payment Flow

| Frontend Component | API Endpoint | Method | Purpose |
|-------------------|-------------|--------|---------|
| `MyRentalsPage` | `/api/payments/checkout/:rentalId` | POST | Create Stripe Checkout session, returns `{ checkoutUrl }` |
| `PaymentSuccessPage` | — | — | Handles Stripe redirect after successful payment |
| `PaymentCancelPage` | — | — | Handles Stripe redirect after cancelled payment |

---

## Backend Response Formats

### Standard Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPage": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Error message"
}
```

## Rental Status Flow

```
PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
    ↓         ↓
  CANCELLED
```

- `PLACED`: Initial state after customer creates rental
- `CONFIRMED`: Provider confirms the order
- `PAID`: Stripe webhook confirms payment
- `PICKED_UP`: Provider marks gear as picked up
- `RETURNED`: Provider marks gear as returned
- `CANCELLED`: Can be cancelled from PLACED status

## Authentication

- JWT tokens stored in httpOnly cookies:
  - `accessToken`: 24h expiry
  - `refreshToken`: 7d expiry
- All API calls use `credentials: "include"` for cookie transmission
- Token refresh via `POST /api/auth/refresh-token` reads `refreshToken` cookie
- Logout clears both cookies

## Services Layer Architecture

```
Component/Page
  ↓ (useQuery / useMutation hook)
Service Function (gear.service.ts, rental.service.ts, etc.)
  ↓ (apiFetch<T>() generic wrapper)
Backend API (https://gearup-backend-b7a4.onrender.com/api)
```
