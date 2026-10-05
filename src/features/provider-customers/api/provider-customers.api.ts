import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProviderCustomerBusinessProfile {
  phone?: string | null;
  address?: string | null;
}

export interface ProviderCustomerService {
  id: string;
  title: string;
  description: string;
  price: number;
  availability: boolean;
  providerId: string;
  createAt?: string;
  updatedAt?: string;
}

export interface ProviderCustomerOrder {
  id: string;
  customerId: string;
  serviceId: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
  service?: ProviderCustomerService;
}

export interface ProviderCustomer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  businessProfile?: ProviderCustomerBusinessProfile | null;
  customerOrders?: ProviderCustomerOrder[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const providerCustomersApi = {
  // 1. Get all customers who ordered services from the logged-in provider
  getProviderCustomers: () => {
    return apiClient<ProviderCustomer[]>("/customer", {
      method: "GET",
    });
  },

  // 2. Get details for a specific customer belonging to the logged-in provider
  getProviderCustomerById: (id: string) => {
    return apiClient<ProviderCustomer>(`/customer/${id}`, {
      method: "GET",
    });
  },
};

