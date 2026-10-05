import { apiClient } from "@/lib/api-client";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  availability: boolean;
  providerId: string;
  createAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  title: string;
  description: string;
  price: number;
  availability?: boolean;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  availability?: boolean;
}

export interface GetAllServicesQuery {
  search?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  availability?: boolean | string;
}

export const servicesApi = {
  // 1. Get services created by the currently logged-in provider
  getMyServices: () => {
    return apiClient<Service[]>("/service/my-services", {
      method: "GET",
    });
  },

  // 2. Get specific service details by service ID
  getServiceDetails: (id: string) => {
    return apiClient<Service>(`/service/service-details/${id}`, {
      method: "GET",
    });
  },

  // 3. Create a new service (Provider only)
  createService: (payload: CreateServicePayload) => {
    return apiClient<Service>("/service/create-service", {
      method: "POST",
      data: payload,
    });
  },

  // 4. Update an existing service (Provider only)
  updateService: (id: string, payload: UpdateServicePayload) => {
    return apiClient<Service>(`/service/update-service/${id}`, {
      method: "PATCH",
      data: payload,
    });
  },

  // 5. Delete a service (Provider only)
  deleteService: (id: string) => {
    return apiClient<Service>(`/service/delete-service/${id}`, {
      method: "DELETE",
    });
  },

  // 6. Get all public services with optional search & filter parameters
  getAllServices: (params?: GetAllServicesQuery) => {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.minPrice !== undefined && params?.minPrice !== "") {
      query.append("minPrice", String(params.minPrice));
    }
    if (params?.maxPrice !== undefined && params?.maxPrice !== "") {
      query.append("maxPrice", String(params.maxPrice));
    }
    if (params?.availability !== undefined && params?.availability !== "") {
      query.append("availability", String(params.availability));
    }

    const queryString = query.toString();
    return apiClient<Service[]>(
      `/service/all-services${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
      }
    );
  },
};
