import { createContext } from "react";

// A minimal user shape decoupled from Firebase's full User interface — the app only
// ever reads name/email, so it stays independent of Firebase's much larger User type.
export type AdminUser = { name: string; email: string };

export type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  /** remember=false keeps the session only until the browser is closed. */
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  /** Emails a Firebase password-reset link to the address. */
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
