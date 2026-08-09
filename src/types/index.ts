export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  image?: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  categoryId: string;
  category?: ICategory;
  provider?: Pick<IUser, "id" | "name" | "email">;
  reviews?: IReview[];
}

export interface IRentalOrder {
  id: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  gearId: string;
  customer?: IUser;
  gear?: IGearItem;
  payment?: IPayment;
}

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface IPayment {
  id: string;
  amount: number;
  transactionId?: string;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  rentalOrderId: string;
  rentalOrder?: IRentalOrder;
}

export interface IReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  gearId: string;
  customer?: Pick<IUser, "id" | "name">;
  gear?: IGearItem;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IMeta;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IProviderDashboard {
  totalGear: number;
  totalRentals: number;
  pendingOrders: number;
  confirmedOrders: number;
  returnedOrders: number;
  totalRevenue: number;
}

export interface ICustomerDashboard {
  totalOrders: number;
  activeOrders: number;
  returnedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface IAdminDashboard {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  activeUsers: number;
  suspendedUsers: number;
  totalCategories: number;
  totalGears: number;
  availableGears: number;
  totalRentals: number;
  completedRentals: number;
  totalPayments: number;
  totalRevenue: number;
}

export interface IAnalytics {
  rentalStatusBreakdown: { status: string; count: number }[];
  userRoleBreakdown: { role: string; count: number }[];
  gearByCategory: { category: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyRentalCount: { month: string; count: number }[];
}

export interface IUserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface IGearFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// backward-compat aliases
export type ApiResponse<T> = IApiResponse<T>;
export type PaginatedResponse<T> = { success: boolean; statusCode: number; message: string; data: T[]; meta: IMeta };
export type IRental = IRentalOrder;
export type IGear = IGearItem;
export type Meta = IMeta;
export type IDashboardAdmin = IAdminDashboard;
export type IDashboardCustomer = ICustomerDashboard;
export type IDashboardProvider = IProviderDashboard;
