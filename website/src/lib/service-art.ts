// Painted artwork for services, keyed by slug (optimized copies written by
// scripts/optimize-images.mjs from public/cards). Services without an entry fall back
// to their icon on a tinted panel wherever art is shown.
export const SERVICE_ART: Record<string, string> = {
  "ai-ml": "/cards/opt/ai-720.webp",
  "generative-ai": "/cards/opt/genai-720.webp",
  "ai-chatbots": "/cards/opt/chatbots-720.webp",
  "ai-automation": "/cards/opt/automation-720.webp",
  "custom-software": "/cards/opt/software-720.webp",
  "web-development": "/cards/opt/web-720.webp",
};
