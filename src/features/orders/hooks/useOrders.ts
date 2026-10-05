import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ordersApi,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../api/orders.api";

// ─── Query Keys ───────────────────────────────────────────────────────────────
const ORDERS_KEY = ["orders"] as const;
const myOrdersKey = () => [...ORDERS_KEY, "my-orders"] as const;
const providerOrdersKey = () => [...ORDERS_KEY, "provider-orders"] as const;
const orderByIdKey = (id: string) => [...ORDERS_KEY, "detail", id] as const;

// ─── 1. Get My Orders (Customer) ──────────────────────────────────────────────
export function useMyOrders() {
  return useQuery({
    queryKey: myOrdersKey(),
    queryFn: () => ordersApi.getMyOrders(),
    staleTime: 30_000,
  });
}

// ─── 2. Get Provider Orders (Provider) ────────────────────────────────────────
export function useProviderOrders() {
  return useQuery({
    queryKey: providerOrdersKey(),
    queryFn: () => ordersApi.getProviderOrders(),
    staleTime: 30_000,
  });
}

// ─── 3. Get Single Order By ID (Shared) ───────────────────────────────────────
export function useOrderById(id: string) {
  return useQuery({
    queryKey: orderByIdKey(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ─── 4. Create Order (Customer) ───────────────────────────────────────────────
export function useCreateOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      ordersApi.createOrder(payload),
    onSuccess: () => {
      toast.success("Booking confirmed! Check your orders.");
      queryClient.invalidateQueries({ queryKey: myOrdersKey() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order. Please try again.");
    },
  });

  return {
    createOrder: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}

// ─── 5. Cancel Order (Customer) ───────────────────────────────────────────────
export function useCancelOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: () => {
      toast.success("Order cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to cancel order. Please try again."
      );
    },
  });

  return {
    cancelOrder: mutation.mutate,
    isPending: mutation.isPending,
  };
}

// ─── 6. Update Order Status (Provider) ────────────────────────────────────────
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderStatusPayload;
    }) => ordersApi.updateOrderStatus(id, payload),
    onSuccess: (data, variables) => {
      const statusLabels: Record<string, string> = {
        CONFIRMED: "Booking Confirmed",
        COMPLETED: "Marked as Completed",
        CANCELLED: "Booking Cancelled",
        PENDING: "Set to Pending",
      };
      toast.success(statusLabels[variables.payload.status] || "Order status updated!");
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update order status. Please try again."
      );
    },
  });

  return {
    updateOrderStatus: mutation.mutate,
    isPending: mutation.isPending,
  };
}
