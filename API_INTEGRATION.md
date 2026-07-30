# 🔗 GearUp Frontend — API Integration Mapping

**🌐 Base URL:** `https://gearup-backend-b7a4.onrender.com`

---

# 🔐 Authentication

| Frontend | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `/auth/login` | `/auth/login` | **POST** | Authenticate user and return access & refresh tokens |
| `/auth/register` | `/users/register` | **POST** | Register a new Customer or Provider |
| `/auth/forgot-password` | `/auth/forgot-password` | **POST** | Reset password (email + oldPassword + newPassword) |
| Navbar Logout | `/auth/logout` | **POST** | Logout user and clear authentication |
| `api.ts` Auto Refresh | `/auth/refresh-token` | **POST** | Refresh expired access token |
| `AuthInitializer` / `useAuthStore` | `/users/me` | **GET** | Fetch authenticated user profile |
| Profile Page | `/users/my-profile` | **PUT** | Update user profile (name, phone) |
| Change Password | `/auth/change-password` | **PATCH** | Update account password |
| Upload Profile Image | `/users/upload-image` | **POST** | Upload profile image using FormData |

---

# 🏋️ Public — Gear Browsing

| Frontend | Endpoint | Method | Query Parameters |
|----------|----------|--------|------------------|
| Homepage — Featured Gear | `/gears` | **GET** | `limit`, `page`, `sortBy`, `sortOrder` |
| `/gear` — Browse & Filter | `/gears` | **GET** | `page`, `limit`, `search`, `categoryId`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder` |
| Categories Page | `/categories` | **GET** | — |
| `/gear/[id]` — Gear Details | `/gears/:id` | **GET** | — |
| `/gear/[id]` — Reviews | `/reviews/gear/:gearId` | **GET** | — |

---

# 👤 Customer — Rentals & Reviews

| Frontend | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `/dashboard/customer` | `/dashboard/customer` | **GET** | Customer dashboard statistics |
| `/dashboard/customer/orders` | `/rentals/my-rentals` | **GET** | Customer rental history |
| Gear Details → Rent Now | `/rentals` | **POST** | Create rental order |
| Cancel Rental | `/rentals/:id/cancel` | **PATCH** | Cancel PLACED/CONFIRMED rental |
| `/dashboard/customer/orders/:id/pay` | `/payments/checkout/:rentalId` | **POST** | Create Stripe Checkout Session |
| `/dashboard/customer/reviews` | `/reviews/my-reviews` | **GET** | Customer reviews |
| Create Review | `/reviews` | **POST** | Submit review after rental |
| Edit Review | `/reviews/:id` | **PATCH** | Update own review |
| Delete Review | `/reviews/:id` | **DELETE** | Remove own review |

---

# 🏪 Provider — Inventory & Order Management

| Frontend | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `/dashboard/provider` | `/dashboard/provider` | **GET** | Provider dashboard overview |
| `/dashboard/provider/gear` | `/gears/my-gears` | **GET** | Provider gear inventory |
| `/dashboard/provider/gear/new` | `/gears` | **POST** | Add new gear |
| Edit Gear | `/gears/:id` | **PATCH** | Update existing gear |
| Delete Gear | `/gears/:id` | **DELETE** | Delete owned gear |
| Toggle Availability | `/gears/:id` | **PATCH** | Update availability status |
| `/dashboard/provider/orders` | `/rentals/provider-orders` | **GET** | Provider incoming rental orders |
| Confirm Order | `/rentals/:id/confirm` | **PATCH** | PLACED → CONFIRMED |
| Mark Picked Up | `/rentals/:id/pickup` | **PATCH** | PAID → PICKED_UP |
| Mark Returned | `/rentals/:id/return` | **PATCH** | PICKED_UP → RETURNED |
| Cancel Order | `/rentals/:id/cancel` | **PATCH** | Cancel pending rental |
| Provider Reviews | `/reviews/gear/:gearId` | **GET** | Reviews for provider's gear |

---

# 🛡️ Admin — Platform Management

| Frontend | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `/dashboard/admin` | `/admin/dashboard` | **GET** | Platform statistics |
| `/dashboard/admin/users` | `/admin/users` | **GET** | User management |
| Suspend User | `/admin/users/:id/suspend` | **PATCH** | Suspend selected user |
| Activate User | `/admin/users/:id/activate` | **PATCH** | Activate suspended user |
| Change User Role | `/admin/users/:id/role` | **PATCH** | Update user role |
| `/dashboard/admin/gears` | `/gears` | **GET** | All gear listings |
| Delete Gear | `/admin/gears/:id` | **DELETE** | Remove gear listing |
| Toggle Availability | `/gears/:id` | **PATCH** | Update gear availability |
| `/dashboard/admin/rentals` | `/admin/rentals` | **GET** | Rental management |
| `/dashboard/admin/payments` | `/admin/payments` | **GET** | Payment monitoring |
| `/dashboard/admin/categories` | `/categories` | **GET** | Category management |
| Create Category | `/categories` | **POST** | Create category |
| Update Category | `/categories/:id` | **PATCH** | Update category |
| Delete Category | `/categories/:id` | **DELETE** | Delete category |
| `/dashboard/admin/reviews` | `/reviews` | **GET** | Review moderation |
| Delete Review | `/reviews/:id` | **DELETE** | Remove any review |

---

# 💳 Stripe Payment (Server-side)

| Event | Endpoint | Description |
|-------|----------|-------------|
| `checkout.session.completed` | `POST /webhooks/stripe` | Automatically marks rental as **PAID** and creates payment record |

---

# 🔄 Authentication Flow

### 1️⃣ Login
- `POST /auth/login`
- Stores **accessToken** in Cookie + localStorage
- Stores **refreshToken** in localStorage

### 2️⃣ Middleware Protection
- Reads `accessToken`
- Decodes JWT
- Verifies authenticated user role
- Protects dashboard routes

### 3️⃣ API Requests
- Automatically sends:

```http
Authorization: Bearer <accessToken>
```

along with:

```ts
credentials: "include"
```

### 4️⃣ Auto Refresh
- If an API returns **401 Unauthorized**
- `api.ts` automatically calls:

```http
POST /auth/refresh-token
```

- Receives new tokens
- Retries the original request automatically

### 5️⃣ Logout
- Clears localStorage tokens
- Removes authentication cookie
- Redirects user to the Home page

---

# 👨‍💼 Admin Credentials

| Email | Password |
|--------|----------|
| **admin@gmail.com** | **admin123** |
