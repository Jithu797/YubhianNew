import { useEffect, useState, type ReactNode } from "react";
import {
  indexedDBLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext, type AdminUser } from "./authContext";

/**
 * Admin sign-in is Firebase Authentication only. An earlier hard-coded fallback login
 * shipped its email and password inside the public JavaScript bundle (and the public
 * repo), so anyone could read it — it has been removed. Create each admin's account in
 * Firebase Console → Authentication → Users, and list their UIDs in firestore.rules
 * (see the website app) so only those accounts can write content or read submissions.
 */

// Session flag left in browsers by the removed fallback login; cleared on load so no
// one stays "signed in" to the UI without a real Firebase session.
const LEGACY_SESSION_KEY = "yubhian-fixed-admin-session";

function mapUser(user: User): AdminUser {
  return { name: user.displayName || user.email || "Admin", email: user.email || "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setUser(auth.currentUser ? mapUser(auth.currentUser) : null);
  }

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_SESSION_KEY);
    } catch {
      // Storage unavailable — nothing to clear.
    }
    // Firebase's subscription-based auth state keeps the UI in sync on sign-in/out.
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? mapUser(fbUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string, remember = true) {
    // Unticking "Remember me" keeps the session in this tab's storage only, so it ends
    // when the browser is closed (useful on a shared computer).
    await setPersistence(auth, remember ? indexedDBLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    await refresh();
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
