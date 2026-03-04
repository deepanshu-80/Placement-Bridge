import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [api.users.me.path],
    queryFn: async () => {
      const res = await fetch(api.users.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.users.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof api.users.login.input._type) => {
      const res = await fetch(api.users.login.path, {
        method: api.users.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      return api.users.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.me.path], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof api.users.register.input._type) => {
      const res = await fetch(api.users.register.path, {
        method: api.users.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Registration failed");
        }
        throw new Error("Registration failed");
      }
      return api.users.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.me.path], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.users.logout.path, {
        method: api.users.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.users.me.path], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
