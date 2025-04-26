import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
} from "@/lib/answerQuery";
import { useToast } from "@/hooks/use-toast";

export const usePostAnswer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      questionId,
      content,
      codeBlocks,
    }: {
      questionId: string;
      content: string;
      codeBlocks?: string;
    }) => postAnswer(questionId, content, codeBlocks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast({
        title: "Success",
        description: "✅ Your answer has been posted successfully!",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to post answer",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      answerId,
      content,
    }: {
      answerId: string;
      content: string;
    }) => updateAnswer(answerId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast({
        title: "Success",
        description: "✅ Answer updated successfully!",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update answer",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
      toast({
        title: "Success",
        description: "✅ Answer deleted successfully!",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete answer",
        variant: "destructive",
      });
    },
  });
};

export const useVoteAnswer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      answerId,
      type,
    }: {
      answerId: string;
      type: "upvote" | "downvote";
    }) => voteAnswer(answerId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to vote",
        variant: "destructive",
      });
    },
  });
};
