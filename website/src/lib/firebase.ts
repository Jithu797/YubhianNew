import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against re-initializing on every hot-reload / re-import in dev.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

/** Rejects a Firestore read that hasn't answered within `ms`. Without a limit, a read
 *  waits indefinitely when Firestore can't be reached (blocked network, missing config),
 *  and a section that waits for it never appears; with it, the caller's fallback runs. */
export function within<T>(read: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    read,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore read timed out")), ms)),
  ]);
}

// Local end-to-end testing against the Firebase Emulator Suite (never set in production).
const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
if (emulatorHost) {
  try {
    connectFirestoreEmulator(db, emulatorHost, 8080);
  } catch {
    // This Firestore instance is already connected (module loaded more than once).
  }
}
export default app;
