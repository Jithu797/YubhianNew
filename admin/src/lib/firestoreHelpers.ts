import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, getCountFromServer, type QueryConstraint } from "firebase/firestore";
import { db } from "./firebase";

export { orderBy, where, limit } from "firebase/firestore";

/** Lists documents in a collection, attaching Firestore's doc.id as `$id` (matching the
 *  shape the admin pages were originally written against for Appwrite documents). */
export async function listDocs<T extends object>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { $id: string })[]> {
  const snap = await getDocs(query(collection(db, collectionName), ...constraints));
  return snap.docs.map((d) => ({ $id: d.id, ...(d.data() as T) }));
}

export async function getDocById<T extends object>(collectionName: string, id: string): Promise<(T & { $id: string }) | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? ({ $id: snap.id, ...(snap.data() as T) }) : null;
}

export async function createDoc(collectionName: string, data: object) {
  return addDoc(collection(db, collectionName), data);
}

export async function updateDocById(collectionName: string, id: string, data: object) {
  return updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDocById(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}

export async function countDocs(collectionName: string, constraints: QueryConstraint[] = []): Promise<number> {
  const snap = await getCountFromServer(query(collection(db, collectionName), ...constraints));
  return snap.data().count;
}
