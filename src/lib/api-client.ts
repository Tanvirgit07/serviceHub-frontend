/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, signOut } from "next-auth/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  data?: unknown;
}

// Token cache in-memory for quick access
let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

// Function to silently refresh access token via backend
async function refreshAuthToken(): Promise<string | null> {
  try {
    const session = await getSession();
    const refreshToken = (session?.user as any)?.refreshToken;

    if (!refreshToken) return null;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const result = await res.json();

    if (!res.ok || !result?.data?.accessToken) {
      return null;
    }

    inMemoryAccessToken = result.data.accessToken;
    return result.data.accessToken;
  } catch {
    return null;
  } finally {
    refreshPromise = null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, headers, ...rest } = options;

  // 1. Get Access Token (from memory or session)
  if (!inMemoryAccessToken) {
    const session = await getSession();
    inMemoryAccessToken = (session?.user as any)?.accessToken || null;
  }

  // 2. Setup Headers
  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    reqHeaders["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }

  const config: RequestInit = {
    ...rest,
    headers: reqHeaders,
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  // 3. Send Request
  let res = await fetch(`${BASE_URL}${endpoint}`, config);

  // 4. Handle 401 Unauthorized (Silent Token Refresh & Auto Retry)
  if (res.status === 401 && !endpoint.includes("/auth/")) {
    if (!refreshPromise) {
      refreshPromise = refreshAuthToken();
    }

    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      // Retry original request with new token
      reqHeaders["Authorization"] = `Bearer ${newAccessToken}`;
      config.headers = reqHeaders;
      res = await fetch(`${BASE_URL}${endpoint}`, config);
    } else {
      // Refresh token also expired -> log out
      inMemoryAccessToken = null;
      if (typeof window !== "undefined") {
        signOut({ callbackUrl: "/signin" });
      }
      throw new Error("Session expired. Please sign in again.");
    }
  }

  const responseData = await res.json().catch(() => null);

  if (
    !res.ok ||
    responseData?.status === false ||
    responseData?.success === false
  ) {
    throw new Error(responseData?.message || "Something went wrong!");
  }

  return responseData?.data as T;
}
