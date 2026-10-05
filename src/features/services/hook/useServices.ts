import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  servicesApi,
  CreateServicePayload,
  UpdateServicePayload,
  GetAllServicesQuery,
} from "../api/services.api";

// Query keys for caching and invalidation
export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters?: GetAllServicesQuery) =>
    [...serviceKeys.lists(), { filters }] as const,
  myServices: () => [...serviceKeys.all, "my-services"] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

/**
 * Hook to fetch all services owned by the logged-in provider
 */
export function useMyServices() {
  return useQuery({
    queryKey: serviceKeys.myServices(),
    queryFn: () => servicesApi.getMyServices(),
  });
}

/**
 * Hook to fetch a single service's details by ID
 */
export function useServiceDetails(id: string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => servicesApi.getServiceDetails(id),
    enabled: Boolean(id),
  });
}

/**
 * Hook to fetch public services with optional filters (search, price, availability)
 */
export function useAllServices(filters?: GetAllServicesQuery) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => servicesApi.getAllServices(filters),
  });
}

/**
 * Hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      servicesApi.createService(payload),
    onSuccess: (data) => {
      // Invalidate relevant queries so UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast.success(`Service "${data.title}" created successfully!`);
      router.push("/provider/p_services");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service. Please try again.");
    },
  });
}

/**
 * Hook to update an existing service (Full edit with redirect)
 */
export function useUpdateService() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServicePayload;
    }) => servicesApi.updateService(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast.success("Service updated successfully!");
      router.push("/provider/p_services");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service. Please try again.");
    },
  });
}

/**
 * Hook to quickly toggle service availability (Active/Paused) without page redirect
 */
export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      availability,
    }: {
      id: string;
      availability: boolean;
    }) => servicesApi.updateService(id, { availability }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast.success(
        `Service is now ${variables.availability ? "Active (Online)" : "Paused (Offline)"}`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update availability status.");
    },
  });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });

      toast.success("Service deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service. Please try again.");
    },
  });
}
