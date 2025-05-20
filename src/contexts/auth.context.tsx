"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/login";
import { toast } from "react-hot-toast";
import { useLogout } from "@/hooks/logout";
import { useUser } from "@/hooks/use.user";
import { User } from "@/services/auth.service";

interface AuthContextType {
  login: (username: string, password: string) => void;
  logout: () => void;
  user: User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { mutate: loginMutation } = useLogin();
  const { mutate: logoutMutation } = useLogout();
  const { data: user } = useUser();

  const login = (username: string, password: string) => {
    loginMutation(
      { username, password },
      {
        onSuccess: () => {
          router.push("/");
          toast.success("Login successful");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const logout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        router.push("/login");
        toast.success("Logout successful");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
