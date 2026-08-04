import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext, type AdminUser } from "./authContext";

/**
 * Fixed admin login, requested as a bridge until real Firebase accounts are created.
 * This credential is visible to anyone who reads the client bundle — fine while the
 * only thing it gates is this CMS.
 *
 * IMPORTANT: with Firestore security rules that check `request.auth != null` (needed
 * once the rules are locked down instead of left fully open), this localStorage-only
 * bridge grants a logged-in *UI* but no real `request.auth` — every Firestore write
 * will fail with permission-denied while running under it. `login()` below tries the
 * real Firebase Auth sign-in with these same credentials FIRST, and only falls back to
 * the local-only bridge if that account doesn't exist yet. Create this exact account in
 * Firebase Console → Authentication → Add user (same email + password) and the fallback
 * stops being used automatically — no code change needed.
 */
const FIXED_ADMIN = {
  email: "founders@yubhiantechnologies.com",
  password: "Turnover#1cr",
  name: "Founders",
};
const FIXED_AUTH_KEY = "yubhian-fixed-admin-session";

function fixedAdminUser(): AdminUser {
  return { name: FIXED_ADMIN.name, email: FIXED_ADMIN.email };
}

function mapUser(user: User): AdminUser {
  return { name: user.displayName || user.email || "Admin", email: user.email || "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (localStorage.getItem(FIXED_AUTH_KEY)) {
      setUser(fixedAdminUser());
      return;
    }
    setUser(auth.currentUser ? mapUser(auth.currentUser) : null);
  }

  useEffect(() => {
    // Mount-time session check for the fixed-admin bridge, mirrored elsewhere in this codebase.
    if (localStorage.getItem(FIXED_AUTH_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(fixedAdminUser());
      setLoading(false);
      return;
    }
    // Firebase's own subscription-based auth-state pattern — replaces the old
    // fetch-on-mount check and stays in sync automatically on sign-in/out.
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? mapUser(fbUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    if (email === FIXED_ADMIN.email && password === FIXED_ADMIN.password) {
      try {
        // Prefer a real Firebase Auth session so `request.auth` is populated for
        // Firestore security rules — this succeeds once the account exists in Console.
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.removeItem(FIXED_AUTH_KEY);
        await refresh();
      } catch {
        // Account not created in Firebase Auth yet — fall back to the local-only
        // bridge so the admin UI still works, though Firestore writes will fail
        // under real security rules until the account exists.
        localStorage.setItem(FIXED_AUTH_KEY, "1");
        setUser(fixedAdminUser());
      }
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
    await refresh();
  }

  async function logout() {
    localStorage.removeItem(FIXED_AUTH_KEY);
    try {
      await signOut(auth);
    } catch {
      // No real Firebase session existed (fixed-admin login) — nothing to sign out of.
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
