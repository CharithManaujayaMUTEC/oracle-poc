export type Role = "director" | "manager" | "nurse" | "caregiver" | "finance" | "guardian";

export type RoomStatus = "occupied" | "vacant" | "reserved" | "maintenance";

export interface Room {
  id: string;
  name: string;
  house: 1 | 2;
  color: string; // gem tone
  soft: string;
  status: RoomStatus;
  resident?: string;
  price: number; // LKR / month (demo)
}

export const ROOMS: Room[] = [
  { id: "jade", name: "Jade", house: 1, color: "#3f9a76", soft: "#dcf0e6", status: "occupied", resident: "r1", price: 185000 },
  { id: "onyx", name: "Onyx", house: 1, color: "#3b3f45", soft: "#e4e6e9", status: "occupied", resident: "r2", price: 195000 },
  { id: "ruby", name: "Ruby", house: 1, color: "#c2395a", soft: "#fbe0e7", status: "vacant", price: 210000 },
  { id: "ivory", name: "Ivory", house: 1, color: "#b8a47a", soft: "#f6efdc", status: "occupied", resident: "r3", price: 175000 },
  { id: "coral", name: "Coral", house: 1, color: "#ee7b61", soft: "#fde4dc", status: "reserved", price: 180000 },
  { id: "pearl", name: "Pearl", house: 2, color: "#9aa7c7", soft: "#e8ecf6", status: "occupied", resident: "r4", price: 190000 },
  { id: "amber", name: "Amber", house: 2, color: "#e0a02b", soft: "#fcefce", status: "occupied", resident: "r5", price: 200000 },
  { id: "sapphire", name: "Sapphire", house: 2, color: "#2f63c4", soft: "#dce7fa", status: "vacant", price: 215000 },
  { id: "opal", name: "Opal", house: 2, color: "#7cc3c9", soft: "#dff2f3", status: "maintenance", price: 185000 },
  { id: "emerald", name: "Emerald", house: 2, color: "#1f8a5b", soft: "#d6efe2", status: "occupied", resident: "r6", price: 220000 },
];

export interface Resident {
  id: string;
  name: string;
  preferred: string;
  age: number;
  room: string;
  hue: string;
  mood: "happy" | "calm" | "tired" | "low";
  alerts: string[];
  mobility: "Independent" | "Cane / frame" | "Wheelchair" | "Hoist";
  diet: string;
  allergies: string[];
  conditions: string[];
  guardian: { name: string; relation: string; phone: string };
  meds: { name: string; dose: string; time: string; status: "due" | "given" | "refused" | "missed" }[];
  vitals: { bp: string; pulse: number; temp: number; spo2: number; weight: number };
  likes: string[];
  since: string;
  care: number; // 1 independent … 4 full
}

export const RESIDENTS: Resident[] = [
  {
    id: "r1", name: "Nimal Perera", preferred: "Nimal Aiya", age: 78, room: "jade", hue: "#3f9a76", mood: "happy",
    alerts: ["Diabetic"], mobility: "Cane / frame", diet: "Diabetic", allergies: ["Penicillin"],
    conditions: ["Type 2 diabetes", "Hypertension"],
    guardian: { name: "Sunil Perera", relation: "Son", phone: "+94 77 123 4567" },
    meds: [
      { name: "Metformin 500mg", dose: "1 tab", time: "08:00", status: "given" },
      { name: "Amlodipine 5mg", dose: "1 tab", time: "12:00", status: "due" },
      { name: "Metformin 500mg", dose: "1 tab", time: "20:00", status: "due" },
    ],
    vitals: { bp: "128/82", pulse: 72, temp: 36.7, spo2: 97, weight: 68 },
    likes: ["Cricket", "Milk tea", "Baila"], since: "Mar 2026", care: 2,
  },
  {
    id: "r2", name: "Kamala Silva", preferred: "Kamala Amma", age: 82, room: "onyx", hue: "#7b6fb5", mood: "calm",
    alerts: ["Falls risk", "Hearing aid"], mobility: "Wheelchair", diet: "Soft",
    allergies: [], conditions: ["Osteoarthritis", "Mild dementia"],
    guardian: { name: "Nadeesha Silva", relation: "Daughter", phone: "+94 71 555 0182" },
    meds: [
      { name: "Paracetamol 500mg", dose: "2 tabs", time: "09:00", status: "given" },
      { name: "Donepezil 5mg", dose: "1 tab", time: "21:00", status: "due" },
    ],
    vitals: { bp: "134/80", pulse: 68, temp: 36.5, spo2: 96, weight: 54 },
    likes: ["Gardening", "Hymns", "Sweet rice"], since: "Jan 2026", care: 3,
  },
  {
    id: "r3", name: "Rajan Selvam", preferred: "Rajan", age: 74, room: "ivory", hue: "#c98a3a", mood: "happy",
    alerts: [], mobility: "Independent", diet: "Vegetarian", allergies: ["Shellfish"],
    conditions: ["Mild asthma"],
    guardian: { name: "Priya Selvam", relation: "Wife", phone: "+94 76 220 9981" },
    meds: [{ name: "Salbutamol inhaler", dose: "2 puffs", time: "PRN", status: "due" }],
    vitals: { bp: "122/78", pulse: 70, temp: 36.6, spo2: 98, weight: 72 },
    likes: ["Carrom", "Newspapers", "Filter coffee"], since: "May 2026", care: 1,
  },
  {
    id: "r4", name: "Fathima Rizwan", preferred: "Fathima Nana", age: 80, room: "pearl", hue: "#6e8ac2", mood: "tired",
    alerts: ["Pressure risk"], mobility: "Wheelchair", diet: "Halal · Soft",
    allergies: ["Latex"], conditions: ["Stroke recovery"],
    guardian: { name: "Imran Rizwan", relation: "Son", phone: "+94 75 888 1210" },
    meds: [
      { name: "Aspirin 75mg", dose: "1 tab", time: "08:00", status: "given" },
      { name: "Atorvastatin 20mg", dose: "1 tab", time: "20:00", status: "due" },
    ],
    vitals: { bp: "140/86", pulse: 76, temp: 36.8, spo2: 95, weight: 59 },
    likes: ["Quran recitation", "Dates", "Family calls"], since: "Feb 2026", care: 3,
  },
  {
    id: "r5", name: "Sita Fernando", preferred: "Sita", age: 85, room: "amber", hue: "#e0a02b", mood: "low",
    alerts: ["Low mood", "Hoist"], mobility: "Hoist", diet: "Pureed",
    allergies: [], conditions: ["Parkinson's", "Dysphagia"],
    guardian: { name: "Dilan Fernando", relation: "Grandson", phone: "+94 70 330 4477" },
    meds: [
      { name: "Levodopa 100mg", dose: "1 tab", time: "07:30", status: "given" },
      { name: "Levodopa 100mg", dose: "1 tab", time: "13:30", status: "missed" },
    ],
    vitals: { bp: "118/74", pulse: 64, temp: 36.4, spo2: 96, weight: 49 },
    likes: ["Old films", "Jasmine tea", "Her cat photos"], since: "Dec 2025", care: 4,
  },
  {
    id: "r6", name: "Anura Jayasuriya", preferred: "Anura", age: 79, room: "emerald", hue: "#1f8a5b", mood: "calm",
    alerts: [], mobility: "Cane / frame", diet: "Regular", allergies: [],
    conditions: ["Hypertension"],
    guardian: { name: "Chamari Jayasuriya", relation: "Daughter", phone: "+94 77 902 6611" },
    meds: [{ name: "Losartan 50mg", dose: "1 tab", time: "08:00", status: "given" }],
    vitals: { bp: "130/84", pulse: 74, temp: 36.6, spo2: 97, weight: 76 },
    likes: ["Chess", "Walks", "Radio drama"], since: "Aug 2026", care: 1,
  },
];

export const MOODS = {
  happy: { icon: "Smile", label: "Content", color: "#3f7d5f" },
  calm: { icon: "Meh", label: "Settled", color: "#176a7c" },
  tired: { icon: "Moon", label: "Tired", color: "#6b7a99" },
  low: { icon: "Frown", label: "Low mood", color: "#9b3b4a" },
} as const;

export interface Service {
  id: string;
  name: string;
  icon: string; // lucide icon name
  price: number; // LKR / month (demo)
  tone: string;
}

export const SERVICES: Service[] = [
  { id: "ac", name: "Air conditioning", icon: "Snowflake", price: 18000, tone: "#176a7c" },
  { id: "fridge", name: "Room fridge", icon: "Refrigerator", price: 6000, tone: "#176a7c" },
  { id: "meals", name: "Tailored meals", icon: "Utensils", price: 32000, tone: "#176a7c" },
  { id: "laundry", name: "Extra laundry", icon: "Shirt", price: 9000, tone: "#176a7c" },
  { id: "car", name: "Private chauffeur", icon: "Car", price: 45000, tone: "#176a7c" },
  { id: "escort", name: "Appointment escort", icon: "HeartHandshake", price: 22000, tone: "#176a7c" },
  { id: "shop", name: "Personal shopping", icon: "ShoppingBag", price: 12000, tone: "#176a7c" },
  { id: "salon", name: "Salon & barber", icon: "Scissors", price: 10000, tone: "#176a7c" },
  { id: "spa", name: "Mani · pedi · podiatry", icon: "Sparkles", price: 14000, tone: "#176a7c" },
  { id: "physio", name: "Physiotherapy", icon: "Activity", price: 38000, tone: "#176a7c" },
  { id: "fit", name: "Fitness & wellness", icon: "Dumbbell", price: 16000, tone: "#176a7c" },
  { id: "concierge", name: "Platinum 60 concierge", icon: "Crown", price: 60000, tone: "#176a7c" },
  { id: "house", name: "Extra housekeeping", icon: "Brush", price: 11000, tone: "#176a7c" },
  { id: "appt", name: "Medical coordination", icon: "Stethoscope", price: 15000, tone: "#176a7c" },
  { id: "meds", name: "Medication delivery", icon: "Pill", price: 8000, tone: "#176a7c" },
  { id: "review", name: "Monthly assessor review", icon: "ClipboardCheck", price: 20000, tone: "#176a7c" },
];

export const fmt = (n: number) => "LKR " + n.toLocaleString("en-US");

export const ROLE_LABEL: Record<Role, string> = {
  director: "Director",
  manager: "Facility Manager",
  nurse: "Nursing",
  caregiver: "Caregiver",
  finance: "Finance",
  guardian: "Guardian",
};

export const DEMO_USERS: Record<Role, { name: string; email: string; title: string; tone: string; icon: string; blurb: string }> = {
  director: { name: "Dr. Ayesha Wijesinghe", email: "director@village60.lk", title: "Director", tone: "#0b4254", icon: "Crown", blurb: "Organisation-wide oversight" },
  manager: { name: "Kasun Ranasinghe", email: "manager@village60.lk", title: "Facility Manager · House 1", tone: "#176a7c", icon: "Building2", blurb: "Run a facility day to day" },
  nurse: { name: "Dilini Fernando", email: "nurse@village60.lk", title: "Lead Nurse · House 1", tone: "#0e8a9a", icon: "Stethoscope", blurb: "Clinical records and medication" },
  caregiver: { name: "Ruwan Jayakody", email: "carer@village60.lk", title: "Caregiver · House 1", tone: "#3f9a76", icon: "HeartHandshake", blurb: "Daily care on the ONE Care app" },
  finance: { name: "Tharushi Gunawardena", email: "finance@village60.lk", title: "Finance & Admissions", tone: "#6b7a99", icon: "Receipt", blurb: "Invoices, payments, pricing" },
  guardian: { name: "Sunil Perera", email: "sunil@family.lk", title: "Guardian of Nimal Perera", tone: "#b07a2a", icon: "Heart", blurb: "ONE Family portal" },
};

export const FACILITIES = [
  { id: "h1", name: "House 1" },
  { id: "h2", name: "House 2" },
] as const;
