import {
  getQuestions,
  postQuestion,
  searchQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "@/lib/questionQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { QuestionFormValues } from "@/types/questionTypes";

export const usePostQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useGetQuestions = (query: string, page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["questions", query, page, limit], // Cache key for different queries
    queryFn: () => getQuestions(query, page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
    onSuccess: (data) => {
      queryClient.setQueryData(["questions", query], data);
    },
  });
};

export const useSearchQuestions = (query: string, page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["questions", query, page, limit], // Cache key for different queries
    queryFn: () => searchQuestions(query, page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
    onSuccess: (data) => {
      queryClient.setQueryData(["questions", query], data);
    },
  });
};

export const useGetQuestionById = (id: string, page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["question", id, page],
    queryFn: () => getQuestionById(id, page, limit),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: Partial<QuestionFormValues>;
    }) => updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast({
        title: "Success",
        description: "✅ Question updated successfully!",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({
        title: "Success",
        description: "✅ Question deleted successfully!",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete question",
        variant: "destructive",
      });
    },
  });
};
