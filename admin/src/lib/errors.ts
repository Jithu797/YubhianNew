import toast from "react-hot-toast";

function codeOf(err: unknown): string {
  return typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
}

/** A sign-in failure explained precisely — previously every failure (wrong password,
 *  missing account, disabled provider, offline) showed "Invalid email or password". */
export function authErrorMessage(err: unknown): string {
  switch (codeOf(err)) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Invalid email or password. If this admin account hasn't been created yet, add it in Firebase Console → Authentication → Users.";
    case "auth/user-disabled":
      return "This account has been disabled in Firebase Authentication.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is turned off. Enable it in Firebase Console → Authentication → Sign-in method.";
    case "auth/too-many-requests":
      return "Too many attempts — Firebase has temporarily blocked sign-in. Wait a few minutes or reset the password.";
    case "auth/network-request-failed":
      return "Can't reach Firebase — check your internet connection.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "The Firebase API key in this build is wrong. Check VITE_FIREBASE_API_KEY in Vercel and redeploy.";
    case "auth/unauthorized-domain":
      return "This domain isn't authorised for sign-in. Add it in Firebase Console → Authentication → Settings → Authorised domains.";
    default:
      return `Sign-in failed (${codeOf(err) || "unknown error"}).`;
  }
}

/** A database failure explained precisely. */
export function firestoreErrorMessage(err: unknown, action: string): string {
  switch (codeOf(err)) {
    case "permission-denied":
      return `Couldn't ${action}: permission denied. Your account must be listed as an admin (its UID) in the published Firestore rules.`;
    case "failed-precondition":
      return `Couldn't ${action}: Firestore needs an index for this list — create it from firestore.indexes.json (the browser console has a direct link).`;
    case "unavailable":
      return `Couldn't ${action}: Firestore is unreachable — check your internet connection.`;
    case "unauthenticated":
      return `Couldn't ${action}: your session expired — please sign in again.`;
    case "not-found":
      return `Couldn't ${action}: the item no longer exists.`;
    default:
      return `Couldn't ${action} (${codeOf(err) || "unknown error"}).`;
  }
}

/** Shows the precise reason once (deduplicated by message) and rethrows, so callers'
 *  own handling still runs. */
export function reportFirestoreError(err: unknown, action: string): never {
  const message = firestoreErrorMessage(err, action);
  toast.error(message, { id: message, duration: 8000 });
  throw err;
}
