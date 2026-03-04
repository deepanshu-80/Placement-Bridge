import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

export function useQA() {
  const { toast } = useToast();

  const questionsQuery = useQuery({
    queryKey: [api.qa.list.path],
  });

  const askMutation = useMutation({
    mutationFn: async (data: { content: string; company?: string }) => {
      const res = await fetch(api.qa.createQuestion.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to ask question");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qa.list.path] });
      toast({ title: "Question posted successfully" });
    },
  });

  const answerMutation = useMutation({
    mutationFn: async (data: { questionId: number; content: string }) => {
      const res = await fetch(api.qa.createAnswer.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to post answer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qa.list.path] });
      toast({ title: "Answer posted successfully" });
    },
  });

  return {
    questions: questionsQuery.data || [],
    isLoading: questionsQuery.isLoading,
    ask: askMutation.mutateAsync,
    isAsking: askMutation.isPending,
    answer: answerMutation.mutateAsync,
    isAnswering: answerMutation.isPending,
  };
}
