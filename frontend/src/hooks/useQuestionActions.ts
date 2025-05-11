import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestion, deleteQuestion } from "@/lib/questionQuery";
import { useToast } from "@/hooks/use-toast";
import { QuestionFormValues } from "@/types/questionTypes";

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
