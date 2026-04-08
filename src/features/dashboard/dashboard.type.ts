export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  currentMonthRevenue: number;
  currentMonthOrders: number;
  currentMonthCustomers: number;
}

export interface MonthlyRevenue {
  key: string;
  year: number;
  month: number;
  total: number;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  overview: MonthlyRevenue[];
  recentSales: RecentOrder[];
}
