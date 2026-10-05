import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  providerProfileApi,
  BusinessProfilePayload,
} from "../api/provider-profile.api";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const PROVIDER_PROFILE_KEY = ["provider-profile"] as const;
export const myBusinessProfileKey = () =>
  [...PROVIDER_PROFILE_KEY, "me"] as const;

// ─── 1. Get My Business Profile ───────────────────────────────────────────────
export function useMyBusinessProfile() {
  return useQuery({
    queryKey: myBusinessProfileKey(),
    queryFn: () => providerProfileApi.getMyBusinessProfile(),
    staleTime: 60_000,
  });
}

// ─── 2. Update/Save Business Profile ──────────────────────────────────────────
export function useSaveBusinessProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: Partial<BusinessProfilePayload>) =>
      providerProfileApi.updateBusinessProfile(payload),
    onSuccess: () => {
      toast.success("Business profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: PROVIDER_PROFILE_KEY });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update business profile. Please try again."
      );
    },
  });

  return {
    saveProfile: mutation.mutate,
    isPending: mutation.isPending,
  };
}

