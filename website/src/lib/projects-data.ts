// Delivered projects shown on /work as proof of work. Add real projects only — each
// entry should be something Yubhian actually built and is happy to name publicly.
// The projects section stays hidden while this list is empty.
export type Project = {
  name: string;
  /** Client or organisation the project was built for */
  client: string;
  industry: string;
  year?: string;
  summary: string;
  /** What Yubhian delivered, e.g. ["Web app", "AI chatbot"] */
  services: string[];
  /** Public link to the live product, if any */
  url?: string;
};

export const PROJECTS: Project[] = [];
