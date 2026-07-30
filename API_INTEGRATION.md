# GearUp Frontend — API Integration Mapping

Base URL: `http://localhost:5000/api`

---

## Authentication

| Frontend Route / Component | Backend Endpoint | Method | Description |
|---------------------------|------------------|--------|-------------|
| `/auth/login` — Login form | `/auth/login` | POST | Authenticate user, returns JWT tokens |
| `/auth/register` — Register form | `/users/register` | POST | Create new user account (CUSTOMER or PROVIDER) |
| Logout button (Navbar) | `/auth/logout` | POST | Clear auth cookies |
| `api.ts` auto-refresh logic | `/auth/refresh-token` | POST | Refresh access token using refresh token |
| `AuthInitializer` (providers.tsx) | `/users/me` | GET | Fetch authenticated user profile |

## Public — Gear Browsing

| Frontend Route / Component | Backend Endpoint | Method | Description |
|---------------------------|------------------|--------|-------------|
| Home page featured grid | `/gears` | GET | List gears (paginated, with search/filter) |
| `/gear` — Browse & filter | `/gears` | GET | Paginated gear list with filters |
| Home page categories | `/categories` | GET | List all categories |
| `/gear` filter sidebar | `/categories` | GET | Categories for filter dropdown |
| `/gear/[id]` — Gear details | `/gears/:id` | GET | Single gear with category & provider info |
| `/gear/[id]` — Reviews section | `/reviews/gear/:gearId` | GET | All reviews for a gear item |

## Customer — Rental & Payment

| Frontend Route / Component | Backend Endpoint | Method | Description |
|---------------------------|------------------|--------|-------------|
| `/dashboard/customer` — Dashboard | `/dashboard/customer` | GET | Customer dashboard stats |
| `/dashboard/customer/orders` — My Orders | `/rentals/my-rentals` | GET | Customer's rentals (paginated, filterable) |
| Gear detail page — Rent Now | `/rentals` | POST | Create new rental order (PLACED) |
| Customer orders — Cancel button | `/rentals/:id/cancel` | PATCH | Cancel a PLACED/CONFIRMED order |
| `/dashboard/customer/orders/[id]/pay` | `/payments/checkout/:rentalId` | POST | Create Stripe Checkout session |
| `/dashboard/customer/reviews` — My Reviews | `/reviews/my-reviews` | GET | Customer's submitted reviews |
| Review form submission | `/reviews` | POST | Create review for returned gear |
| Delete review | `/reviews/:id` | DELETE | Remove own review |

## Provider — Inventory & Orders

| Frontend Route / Component | Backend Endpoint | Method | Description |
|---------------------------|------------------|--------|-------------|
| `/dashboard/provider` — Dashboard | `/dashboard/provider` | GET | Provider dashboard stats |
| `/dashboard/provider/gear` — My Gear | `/gears/my-gears` | GET | Provider's owned gear items |
| `/dashboard/provider/gear/new` — Add Gear | `/gears` | POST | Create new gear listing |
| `/dashboard/provider/gear/[id]/edit` | `/gears/:id` | PATCH | Update own gear listing |
| My Gear page — Delete | `/gears/:id` | DELETE | Delete own gear |
| My Gear page — Toggle availability | `/gears/:id` | PATCH | Update isAvailable flag |
| `/dashboard/provider/orders` — Orders | `/rentals/provider-orders` | GET | Incoming orders for provider's gear |
| Confirm order | `/rentals/:id/confirm` | PATCH | Confirm PLACED order |
| Mark Picked Up | `/rentals/:id/pickup` | PATCH | Mark PAID order as PICKED_UP |
| Mark Returned | `/rentals/:id/return` | PATCH | Mark PICKED_UP order as RETURNED |
| Cancel order (provider) | `/rentals/:id/cancel` | PATCH | Cancel order |

## Admin — Platform Management

| Frontend Route / Component | Backend Endpoint | Method | Description |
|---------------------------|------------------|--------|-------------|
| `/dashboard/admin` — Dashboard | `/admin/dashboard` | GET | Platform-wide statistics |
| `/dashboard/admin/users` — Users | `/admin/users` | GET | All users (paginated, searchable) |
| Suspend user | `/admin/users/:id/suspend` | PATCH | Suspend a user |
| Activate user | `/admin/users/:id/activate` | PATCH | Activate a suspended user |
| Change user role | `/admin/users/:id/role` | PATCH | Change user's role |
| `/dashboard/admin/gears` — Gear | `/gears` | GET | All gear listings |
| Remove gear (admin) | `/admin/gears/:id` | DELETE | Soft-delete gear (sets isAvailable=false) |
| `/dashboard/admin/rentals` | `/rentals/all` | GET | All rental orders (paginated) |
| `/dashboard/admin/payments` | `/admin/payments` | GET | All payments (paginated) |

## Stripe Webhook (Server-side)

| Event | Backend Endpoint | Description |
|-------|------------------|-------------|
| `checkout.session.completed` | `POST /api/webhooks/stripe` | Updates rental to PAID, creates Payment record |

---

## Auth Flow

1. **Login**: Stores `accessToken` + `refreshToken` in localStorage and sets `accessToken` cookie
2. **Middleware**: Reads `accessToken` cookie to protect routes, decodes JWT payload to check role
3. **API calls**: Sends `Authorization: Bearer <accessToken>` header
4. **Auto-refresh**: On 401 response, calls `/auth/refresh-token` and retries

## Admin Credentials

- **Email**: `admin@gearup.com`
- **Password**: `admin123`
