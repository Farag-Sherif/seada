import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, login, logout, register } from "@/actions/auth";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => getUser(),
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
}
