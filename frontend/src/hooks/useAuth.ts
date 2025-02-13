import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
} from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAuthLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAuthSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAuthLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAuthFogotPass = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useAuthResetPass = () => {
  return useMutation({
    mutationFn: (variables: { data: any; token: string }) =>
      resetPassword(variables.data, variables.token),
  });
};
