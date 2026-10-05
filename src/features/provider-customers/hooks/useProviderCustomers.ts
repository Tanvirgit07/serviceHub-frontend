import { useQuery } from "@tanstack/react-query";
import {
  providerCustomersApi,
  ProviderCustomer,
} from "../api/provider-customers.api";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const PROVIDER_CUSTOMERS_KEY = ["provider-customers"] as const;
export const providerCustomerDetailsKey = (id: string) =>
  [...PROVIDER_CUSTOMERS_KEY, "detail", id] as const;

// ─── 1. Get All Customers of Provider ─────────────────────────────────────────
export function useProviderCustomers() {
  return useQuery<ProviderCustomer[], Error>({
    queryKey: PROVIDER_CUSTOMERS_KEY,
    queryFn: () => providerCustomersApi.getProviderCustomers(),
    staleTime: 30_000,
  });
}

// ─── 2. Get Single Customer Details ───────────────────────────────────────────
export function useProviderCustomerDetails(customerId: string | null) {
  return useQuery<ProviderCustomer, Error>({
    queryKey: customerId ? providerCustomerDetailsKey(customerId) : [...PROVIDER_CUSTOMERS_KEY, "none"],
    queryFn: () => {
      if (!customerId) throw new Error("Customer ID is required");
      return providerCustomersApi.getProviderCustomerById(customerId);
    },
    enabled: !!customerId,
    staleTime: 30_000,
  });
}
