export type CareerDef = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

// No static fallback list — an open-positions page implies real, current openings,
// so it's more honest to show "no open positions" than fabricated job listings.
export const CAREERS_FALLBACK: CareerDef[] = [];

/** Fetches active job postings from Firestore for the public Careers page.
 *  Returns an empty array (not fake data) when Firestore isn't reachable yet or is empty. */
export async function getAllCareers(): Promise<CareerDef[]> {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
    const snap = await getDocs(
      query(collection(db, "careers"), where("is_active", "==", true), orderBy("order", "asc"))
    );
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          slug: d.slug,
          title: d.title,
          department: d.department ?? "",
          location: d.location ?? "",
          type: d.type ?? "Full-time",
          description: d.description ?? "",
          requirements: d.requirements ?? [],
        };
      });
    }
  } catch {
    // Firestore not reachable yet — keep fallback
  }
  return CAREERS_FALLBACK;
}

export async function getCareerBySlugRemote(slug: string): Promise<CareerDef | undefined> {
  const careers = await getAllCareers();
  return careers.find((c) => c.slug === slug);
}
