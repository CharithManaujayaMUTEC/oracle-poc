import { ROOMS } from "./data";

export const IMAGES = ["/images/room.jpg", "/images/lounge.jpg", "/images/hero.jpg", "/images/community.jpg"];

export type Tier = "Essential 60" | "Comfort 60" | "Platinum 60";

const TIER: Record<string, Tier> = {
  ivory: "Essential 60", jade: "Essential 60", coral: "Essential 60",
  pearl: "Comfort 60", amber: "Comfort 60", onyx: "Comfort 60", opal: "Comfort 60",
  emerald: "Platinum 60", sapphire: "Platinum 60", ruby: "Platinum 60",
};

const SIZE: Record<string, number> = {
  jade: 28, onyx: 32, ruby: 40, ivory: 26, coral: 30,
  pearl: 30, amber: 34, sapphire: 42, opal: 32, emerald: 44,
};

export const FEATURE_ICON: Record<string, string> = {
  "En-suite bathroom": "ShowerHead",
  "Call pendant": "BellRing",
  "Profiling bed": "BedDouble",
  "Wheelchair access": "Accessibility",
  "Air conditioning": "Snowflake",
  "Refrigerator": "Refrigerator",
  "Smart TV": "Tv",
  "Garden view": "TreePine",
  "Private balcony": "Sun",
  "Reading nook": "BookOpen",
};

export interface Detail {
  id: string;
  tier: Tier;
  size: number;
  bed: string;
  floor: string;
  view: string;
  features: string[];
  image: number;
}

export function detail(id: string): Detail | null {
  const r = ROOMS.find((x) => x.id === id);
  if (!r) return null;
  const tier = TIER[id];
  const features = ["En-suite bathroom", "Call pendant", "Profiling bed", "Wheelchair access"];
  if (tier !== "Essential 60") features.push("Air conditioning", "Refrigerator", "Smart TV");
  if (tier === "Platinum 60") features.push("Private balcony", "Reading nook");
  if (tier === "Essential 60") features.push("Garden view");
  const idx = ROOMS.findIndex((x) => x.id === id);
  return {
    id,
    tier,
    size: SIZE[id],
    bed: SIZE[id] >= 40 ? "Double" : "Single",
    floor: r.house === 1 ? "Ground floor" : "First floor",
    view: tier === "Platinum 60" ? "Garden & courtyard" : r.house === 1 ? "Garden" : "Courtyard",
    features,
    image: idx % IMAGES.length,
  };
}
