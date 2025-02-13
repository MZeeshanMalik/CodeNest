import { EmailFormValues } from "@/app/(auth)/forgot-password/page";
import { LoginFormValues } from "@/types/loginTypes";
import { SignupData } from "@/types/signupSchema";
import { API_URL } from "@/utils/apiRoutes";
import axios from "axios";

export const login = async (data: LoginFormValues) => {
  const response = await axios.post(`${API_URL}/api/v1/users/login`, data, {
    withCredentials: true,
  });
  console.log(response);
  return response.data;
};

export const signup = async (data: SignupData) => {
  const response = await axios.post(`${API_URL}/api/v1/users/signup`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.get(`${API_URL}/api/v1/users/logout`, {
    withCredentials: true,
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/api/v1/users/forgotPassword`, {
    email,
  });
  return response.data;
};
export const resetPassword = async (data: EmailFormValues, tokekn: string) => {
  console.log(API_URL);
  const response = await axios.patch(
    `${API_URL}/api/v1/users/resetPassword/?resetToken=${tokekn}`,
    data,
    { withCredentials: true }
  );

  return response.data;
};
