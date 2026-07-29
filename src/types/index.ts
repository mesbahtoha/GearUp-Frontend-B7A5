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
  images: string[];
  pricePerDay: number;
  location: string;
  categoryId: string;
  category?: ICategory;
  providerId: string;
  provider?: IUser;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRental {
  id: string;
  gearId: string;
  gear?: IGear;
  customerId: string;
  customer?: IUser;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  rentalId: string;
  rental?: IRental;
  customerId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transactionId?: string;
  stripeSessionId?: string;
  createdAt: string;
}

export interface IReview {
  id: string;
  gearId: string;
  gear?: IGear;
  customerId: string;
  customer?: IUser;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardCustomer {
  totalRentals: number;
  totalSpent: number;
  activeRentals: number;
  recentRentals: IRental[];
  payments: IPayment[];
}

export interface IDashboardProvider {
  totalGears: number;
  totalOrders: number;
  activeRentals: number;
  totalEarnings: number;
  recentOrders: IRental[];
}

export interface IDashboardAdmin {
  totalUsers: number;
  totalGears: number;
  totalRentals: number;
  totalRevenue: number;
  recentUsers: IUser[];
  recentRentals: IRental[];
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
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
