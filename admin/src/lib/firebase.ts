import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Settings the admin cannot start without. Vite bakes env vars in at BUILD time, so on
// Vercel they must be set in the project before deploying (and a redeploy is needed
// after changing them). Missing values used to crash Firebase on load and leave a
// blank white page; now the app shows a setup screen naming what's missing instead.
const REQUIRED = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
  VITE_WEBSITE_API_URL: import.meta.env.VITE_WEBSITE_API_URL,
};
export const missingConfig: string[] = Object.entries(REQUIRED)
  .filter(([, v]) => !v || String(v).trim() === "")
  .map(([k]) => k);

let app: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

if (missingConfig.length === 0) {
  // Guard against re-initializing on every hot-reload / re-import in dev.
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
  // Local end-to-end testing against the Firebase Emulator Suite (never set in production).
  const emulator = import.meta.env.VITE_FIREBASE_EMULATOR_HOST as string | undefined;
  if (emulator) {
    connectFirestoreEmulator(dbInstance, emulator, 8080);
    connectAuthEmulator(authInstance, `http://${emulator}:9099`, { disableWarnings: true });
  }
}

// Only read after App.tsx has confirmed the config is complete.
export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;
export default app;
