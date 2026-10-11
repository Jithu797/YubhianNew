export type ClientDef = {
  name: string;
  logoUrl: string | null;
  industry: string;
  websiteUrl: string;
};

// A copy of the real clients entered in the admin (Firestore "clients", in admin order),
// shown straight away and whenever Firestore can't be reached, so the logo wall never
// disappears. The admin list replaces it as soon as Firestore answers. Only ever add
// clients here that also exist in the admin — never invented ones.
export const CLIENTS_FALLBACK: ClientDef[] = [
  {
    name: "ReNu-Biome",
    logoUrl: "https://res.cloudinary.com/dvq2shkor/image/upload/v1785840835/yubhian/clients/biivxlnagj01xb0wrslp.webp",
    industry: "ReNu-Biome",
    websiteUrl: "https://renu-biome.com/",
  },
  {
    name: "ZeraForge",
    logoUrl: "https://res.cloudinary.com/dvq2shkor/image/upload/v1785842100/yubhian/clients/syck5vay9vubg95mw2lx.jpg",
    industry: "IT Services",
    websiteUrl: "https://www.zeraforge.com/",
  },
  {
    name: "The Waterbase Ltd",
    logoUrl: "https://res.cloudinary.com/dvq2shkor/image/upload/v1785842187/yubhian/clients/ug9jq5spvwws1fx9eqlk.webp",
    industry: "Aqua Industry",
    websiteUrl: "https://waterbaseindia.com/",
  },
  {
    name: "Vishnu Educational Society",
    logoUrl: "https://res.cloudinary.com/dvq2shkor/image/upload/v1785842260/yubhian/clients/ph3nllk8gg1vbxjbr16x.jpg",
    industry: "Educational Industry",
    websiteUrl: "https://www.srivishnu.edu.in/",
  },
  {
    name: "Green Fusion Technologies",
    logoUrl: "https://res.cloudinary.com/dvq2shkor/image/upload/v1785842345/yubhian/clients/i77mr6v8svvldhifb3lt.jpg",
    industry: "IoT Industry",
    websiteUrl: "",
  },
];

/** Fetches active clients from Firestore for the public "Our Clients" showcase.
 *  Returns an empty array (not fake data) when Firestore isn't reachable yet or is empty. */
export async function getAllClients(): Promise<ClientDef[]> {
  try {
    const { db, within } = await import("./firebase");
    const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
    const snap = await within(getDocs(
      query(collection(db, "clients"), where("is_active", "==", true), orderBy("order", "asc"))
    ));
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
