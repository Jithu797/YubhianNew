export type ClientDef = {
  name: string;
  logoUrl: string | null;
  industry: string;
  websiteUrl: string;
};

// Unlike other sections, there's no fabricated fallback list here — a client logo wall
// implies real, verifiable business relationships, so it's more honest to simply hide
// the section (see ClientsShowcase.tsx) until real clients are added in the admin.
export const CLIENTS_FALLBACK: ClientDef[] = [];

/** Fetches active clients from Firestore for the public "Our Clients" showcase.
 *  Returns an empty array (not fake data) when Firestore isn't reachable yet or is empty. */
export async function getAllClients(): Promise<ClientDef[]> {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
    const snap = await getDocs(
      query(collection(db, "clients"), where("is_active", "==", true), orderBy("order", "asc"))
    );
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          name: d.name,
          logoUrl: d.logo_url ?? null,
          industry: d.industry ?? "",
          websiteUrl: d.website_url ?? "",
        };
      });
    }
  } catch {
    // Firestore not reachable yet — keep fallback
  }
  return CLIENTS_FALLBACK;
}
