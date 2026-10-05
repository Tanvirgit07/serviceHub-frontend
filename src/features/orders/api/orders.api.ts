import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderService {
  id: string;
  title: string;
  description: string;
  price: number;
  availability: boolean;
  providerId: string;
  createAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  customerId: string;
  serviceId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  service: OrderService;
  customer?: OrderCustomer;
}

export interface CreateOrderPayload {
  serviceId: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const ordersApi = {
  // ── Customer ─────────────────────────────────────────────────────────────

  // 1. Create a new order (Customer only)
  createOrder: (payload: CreateOrderPayload) => {
    return apiClient<Order>("/order", {
      method: "POST",
      data: payload,
    });
  },

  // 2. Get current customer's orders
  getMyOrders: () => {
    return apiClient<Order[]>("/order/my-orders", {
      method: "GET",
    });
  },

  // 3. Get a single order by ID (shared)
  getOrderById: (id: string) => {
    return apiClient<Order>(`/order/${id}`, {
      method: "GET",
    });
  },

  // 4. Cancel an order (Customer only)
  cancelOrder: (id: string) => {
    return apiClient<Order>(`/order/${id}/cancel`, {
      method: "PATCH",
    });
  },

  // ── Provider ─────────────────────────────────────────────────────────────

  // 5. Get all orders for the currently logged-in provider
  getProviderOrders: () => {
    return apiClient<Order[]>("/order/provider-orders", {
      method: "GET",
    });
  },

  // 6. Update order status (Provider only)
  updateOrderStatus: (id: string, payload: UpdateOrderStatusPayload) => {
    return apiClient<Order>(`/order/${id}/status`, {
      method: "PATCH",
      data: payload,
    });
  },
};
