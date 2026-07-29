export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
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

export interface IGear {
  id: string;
  name: string;
  description: string;
  brand: string;
  image: string | null;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  provider?: IUser;
  categoryId: string;
  category?: ICategory;
}

export interface IRental {
  id: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer?: IUser;
  gearId: string;
  gear?: IGear;
  payment?: IPayment;
}

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
  rentalOrder?: IRental;
}

export interface IReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer?: IUser;
  gearId: string;
  gear?: IGear;
}

export interface IDashboardCustomer {
  totalOrders: number;
  activeOrders: number;
  returnedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
}

export interface IDashboardProvider {
  totalGear: number;
  totalRentals: number;
  pendingOrders: number;
  confirmedOrders: number;
  returnedOrders: number;
  totalRevenue: number;
}

export interface IDashboardAdmin {
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

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
