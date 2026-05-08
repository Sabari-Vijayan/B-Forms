import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/lib/api";

export function useGetMe() {
  return useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => customFetch<{ id: string; email: string }>("/api/auth/me"),
    retry: false,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: any) =>
      customFetch<any>("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}
