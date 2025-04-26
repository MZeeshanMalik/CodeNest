import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { LoginFormValues } from "@/types/loginTypes";

interface User {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

// Define the shape of the context value
type AuthContextType = {
  user: User | null;
  login: (userData: User | LoginFormValues) => void;
  logout: () => void;
};

// Create the context with an initial value that matches the type
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: User | LoginFormValues) => {
    if ("_id" in userData) {
      setUser(userData as User);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context and a custom hook for using the context
export const useAuth = () => useContext(AuthContext);
