"use client";
import clientAxiosInstance from "@/lib/client-axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


interface AuthContextType {
  isAuthenticated: boolean;
  author: any | null;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [author, setAuthor] = useState<any | Author>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Check local storage or token validity
      const token = localStorage.getItem("token");
      if (token) {
        // Get author profile
        const userData = await getProfile();
        setAuthor(userData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      await clientAxiosInstance.get("/logout");
      localStorage.removeItem("token");
      setAuthor(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    isAuthenticated: !!author,
    author,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper functions (replace these with your actual authentication logic)
async function getProfile() {
  const { data } = await clientAxiosInstance.get("/profile");

  return data.data;
}


