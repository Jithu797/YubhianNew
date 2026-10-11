import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, getCountFromServer, type QueryConstraint } from "firebase/firestore";
import { db } from "./firebase";
import { reportFirestoreError } from "./errors";

export { orderBy, where, limit } from "firebase/firestore";

// Every helper reports the precise failure reason (permission denied, missing index,
// offline…) as a toast before rethrowing. Pages catch errors to keep the UI usable, and
// previously did so silently — a permissions problem looked exactly like "no data yet".

/** Lists documents in a collection, attaching Firestore's doc.id as `$id` (matching the
 *  shape the admin pages were originally written against for Appwrite documents). */
export async function listDocs<T extends object>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { $id: string })[]> {
  try {
    const snap = await getDocs(query(collection(db, collectionName), ...constraints));
    return snap.docs.map((d) => ({ $id: d.id, ...(d.data() as T) }));
  } catch (err) {
    return reportFirestoreError(err, `load ${collectionName.replace(/_/g, " ")}`);
  }
}

export async function getDocById<T extends object>(collectionName: string, id: string): Promise<(T & { $id: string }) | null> {
  try {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? ({ $id: snap.id, ...(snap.data() as T) }) : null;
  } catch (err) {
    return reportFirestoreError(err, `load this ${collectionName.replace(/_/g, " ")} item`);
  }
}

export async function createDoc(collectionName: string, data: object) {
  try {
    return await addDoc(collection(db, collectionName), data);
  } catch (err) {
    return reportFirestoreError(err, "save");
  }
}

export async function updateDocById(collectionName: string, id: string, data: object) {
  try {
    return await updateDoc(doc(db, collectionName, id), data);
  } catch (err) {
    return reportFirestoreError(err, "save changes");
  }
}

export async function deleteDocById(collectionName: string, id: string) {
  try {
    return await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    return reportFirestoreError(err, "delete");
  }
}

export async function countDocs(collectionName: string, constraints: QueryConstraint[] = []): Promise<number> {
  try {
    const snap = await getCountFromServer(query(collection(db, collectionName), ...constraints));
    return snap.data().count;
  } catch (err) {
    return reportFirestoreError(err, `count ${collectionName.replace(/_/g, " ")}`);
  }
}
