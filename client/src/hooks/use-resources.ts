import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

export function useResources() {
  const { toast } = useToast();

  const resourcesQuery = useQuery({
    queryKey: [api.resources.list.path],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; type: string; company?: string }) => {
      const res = await fetch(api.resources.create.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.resources.list.path] });
      toast({ title: "Resource shared successfully" });
    },
  });

  return {
    resources: resourcesQuery.data || [],
    isLoading: resourcesQuery.isLoading,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
