import { createContext } from "react";

// A minimal user shape decoupled from Firebase's full User interface — the app only
// ever reads name/email, so it stays independent of Firebase's much larger User type.
export type AdminUser = { name: string; email: string };

export type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
