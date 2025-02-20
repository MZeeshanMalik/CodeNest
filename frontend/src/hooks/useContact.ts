import { sendContactForm } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendContactForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
