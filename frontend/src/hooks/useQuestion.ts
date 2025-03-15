import { postQuestion } from "@/lib/questionQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
