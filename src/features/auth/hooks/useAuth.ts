/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { authApi, SignupPayload } from "../api/auth.api";

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: () => {
      toast.success("Account created successfully! Please sign in.");
      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Signup failed. Please try again.");
    },
  });
}

export function useLogout() {
  const logout = async (callbackUrl = "/signin") => {
    try {
      const session = await getSession();
      const refreshToken = (session?.user as any)?.refreshToken;

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error("Backend logout error:", error);
    } finally {
      await signOut({ callbackUrl });
    }
  };

  return { logout };
}