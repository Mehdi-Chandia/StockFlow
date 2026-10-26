import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getUser, logoutUser } from "../services/authService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: ()=> Promise<void>
}

interface AuthProviderPropType {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderPropType) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigateTo= useNavigate();

  const handleUser = async () => {
    setIsLoading(true);
    try {
      const response = await getUser();

      setIsAuthenticated(true);
      setUser(response.data);
      // console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // alert(error?.response?.data);
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout= async ()=>{
    try {
      await logoutUser();
      setUser(null)
      setIsAuthenticated(false)
      alert("Logged out successfully!")
      navigateTo("/login")

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        alert(error.response?.data)
      }
    }
  }

  useEffect(() => {
    handleUser();
  }, []);

  useEffect(() => {
  const handleSessionExpired = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  window.addEventListener(
    "auth:session-expired",
    handleSessionExpired
  );

  return () => {
    window.removeEventListener(
      "auth:session-expired",
      handleSessionExpired
    );
  };
}, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("auth cannot be used outside a provider");
  }

  return context;
};
