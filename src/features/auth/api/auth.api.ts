import { apiClient } from "@/lib/api-client";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER";
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updateAt: string;
}

export const authApi = {
  signup: (payload: SignupPayload) => {
    return apiClient<SignupResponse>("/auth/signup", {
      method: "POST",
      data: payload,
    });
  },

  logout: (refreshToken: string) => {
    return apiClient<{ message: string }>("/auth/logout", {
      method: "POST",
      data: { refreshToken },
    });
  },
};

