import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BusinessProfileAccount {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  description?: string | null;
  phone: string;
  address: string;
  accountId: string;
  createAt: string;
  updateAt: string;
  account?: BusinessProfileAccount;
}

export interface BusinessProfilePayload {
  businessName: string;
  description?: string;
  phone: string;
  address: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const providerProfileApi = {
  // 1. Get logged-in provider's business profile
  getMyBusinessProfile: () => {
    return apiClient<BusinessProfile | null>("/b_profile/me", {
      method: "GET",
    });
  },

  // 2. Create business profile
  createBusinessProfile: (payload: BusinessProfilePayload) => {
    return apiClient<BusinessProfile>("/b_profile", {
      method: "POST",
      data: payload,
    });
  },

  // 3. Update business profile
  updateBusinessProfile: (payload: Partial<BusinessProfilePayload>) => {
    return apiClient<BusinessProfile>("/b_profile/me", {
      method: "PATCH",
      data: payload,
    });
  },
};

