import { EmailFormValues } from "@/app/(auth)/forgot-password/page";
import { ContactFormValues } from "@/types/contactTypes";
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
  try {
    const response = await axios.get(`${API_URL}/api/v1/users/logout`, {
      withCredentials: true,
    });
    // If the logout was successful, remove user data from localStorage
    if (response.data.status === "success" || response.status === 200) {
      localStorage.removeItem("user");
      // You might want to remove other user-related items as well
      localStorage.removeItem("token");
      localStorage.removeItem("userPreferences");
      sessionStorage.removeItem("user");
    }
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
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

export const sendContactForm = async (data: ContactFormValues) => {
  const response = await axios.post(`${API_URL}/api/v1/contact`, data);
  return response.data;
};
