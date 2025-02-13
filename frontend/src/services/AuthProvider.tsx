import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { LoginFormValues } from "@/types/loginTypes";

// Define the shape of the context value
type AuthContextType = {
  user: object; // Replace `object` with a more specific type if needed
  login: (userData: LoginFormValues) => void;
  logout: () => void;
};

// Create the context with an initial value that matches the type
const AuthContext = createContext<AuthContextType>({
  user: {},
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<object | "">("");

  useEffect(() => {
    // Check if there's a token in the URL (for redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userObj = urlParams.get("user");

    if (token) {
      document.cookie = `jwt=${token}; path=/; max-age=86400; Secure; SameSite=Lax`;
      const userData = JSON.parse(decodeURIComponent(userObj));
      // const userData = { userObj }; // Store name as well
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      window.location.replace("/"); // Redirect to the home page or dashboard after login
    } else {
      // Check if user data exists in localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const login = (userData: LoginFormValues) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser("");
    localStorage.removeItem("user");
    localStorage.removeItem("jwt"); // Remove JWT token from localStorage
    // Optionally, make a request to backend to invalidate JWT
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context and a custom hook for using the context
export const useAuth = () => useContext(AuthContext);
