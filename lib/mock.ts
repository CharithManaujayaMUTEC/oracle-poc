// Demo data for the front-end prototype. Replace with API calls later.

export const ENQ_STATUS = ["New", "Contacted", "Assessment pending", "Visit arranged", "Quotation issued", "Awaiting decision", "Confirmed", "Not proceeding"] as const;
export type EnqStatus = (typeof ENQ_STATUS)[number];

export interface Enquiry {
  id: string; name: string; relation: string; forClient: string; phone: string; country: string;
  source: string; service: string; facility: string; expected: string; budget: number; status: EnqStatus; date: string;
}

export const ENQUIRIES: Enquiry[] = [
  { id: "e1", name: "Ishara Weerasinghe", relation: "Daughter", forClient: "Mrs. Leela Weerasinghe", phone: "+94 77 410 2288", country: "Sri Lanka", source: "WhatsApp", service: "Long-term", facility: "House 1", expected: "Dec 2026", budget: 200000, status: "New", date: "05 Nov" },
  { id: "e2", name: "Rohan Tennakoon", relation: "Son", forClient: "Mr. Piyal Tennakoon", phone: "+44 7700 900123", country: "UK", source: "Website", service: "Long-term", facility: "House 2", expected: "Jan 2027", budget: 260000, status: "New", date: "06 Nov" },
  { id: "e3", name: "Mala Dissanayake", relation: "Spouse", forClient: "Mr. Gamini Dissanayake", phone: "+94 71 332 9087", country: "Sri Lanka", source: "Phone", service: "Short stay", facility: "House 1", expected: "Nov 2026", budget: 150000, status: "Contacted", date: "02 Nov" },
  { id: "e4", name: "Dr. Faizal Marikar", relation: "Hospital referral", forClient: "Mrs. Zeenath Marikar", phone: "+94 76 551 7710", country: "Sri Lanka", source: "Hospital", service: "Long-term", facility: "House 2", expected: "Nov 2026", budget: 230000, status: "Assessment pending", date: "30 Oct" },
  { id: "e5", name: "Anjali Fernando", relation: "Daughter", forClient: "Mr. Lalith Fernando", phone: "+61 412 345 678", country: "Australia", source: "Referral", service: "Long-term", facility: "House 1", expected: "Dec 2026", budget: 220000, status: "Visit arranged", date: "28 Oct" },
  { id: "e6", name: "Suresh Kumar", relation: "Son", forClient: "Mrs. Valli Kumar", phone: "+94 75 118 4402", country: "Sri Lanka", source: "WhatsApp", service: "Home care", facility: "—", expected: "Nov 2026", budget: 90000, status: "Quotation issued", date: "25 Oct" },
  { id: "e7", name: "Nilmini Abeysekera", relation: "Daughter", forClient: "Mr. Ananda Abeysekera", phone: "+94 77 902 3345", country: "Sri Lanka", source: "Website", service: "Long-term", facility: "House 2", expected: "Dec 2026", budget: 250000, status: "Awaiting decision", date: "22 Oct" },
  { id: "e8", name: "Chaminda Ratnayake", relation: "Son", forClient: "Mrs. Kusum Ratnayake", phone: "+94 70 667 1209", country: "Sri Lanka", source: "Phone", service: "Long-term", facility: "House 1", expected: "Nov 2026", budget: 190000, status: "Confirmed", date: "15 Oct" },
  { id: "e9", name: "Hasini Jayawardena", relation: "Daughter", forClient: "Mr. Tissa Jayawardena", phone: "+94 71 004 5521", country: "Sri Lanka", source: "WhatsApp", service: "Short stay", facility: "House 1", expected: "Oct 2026", budget: 120000, status: "Not proceeding", date: "10 Oct" },
];

export const ADMISSION_STEPS = ["Enquiry", "Assessment", "Medical review", "Suitability", "Quotation", "Agreement", "Confirmation", "Documents", "Room", "Care plan", "Guardian access", "Handover"];

export const ADMISSIONS = [
  { id: "a1", client: "Kusum Ratnayake", age: 81, room: "Ruby", step: 9, owner: "Dilini Fernando", due: "Mon 9 Nov", note: "Care plan being drafted" },
  { id: "a2", client: "Zeenath Marikar", age: 77, room: "Sapphire", step: 3, owner: "Dilini Fernando", due: "Wed 11 Nov", note: "Awaiting clinical suitability sign-off" },
  { id: "a3", client: "Lalith Fernando", age: 83, room: "Coral", step: 5, owner: "Kasun Ranasinghe", due: "Fri 13 Nov", note: "Agreement sent to guardian" },
];

export const INCIDENT_FLOW = ["Reported", "Under review", "Action taken", "Closed"] as const;
export type IncStatus = (typeof INCIDENT_FLOW)[number];
export interface Incident {
  id: string; type: string; resident: string; date: string; location: string; severity: "Low" | "Medium" | "High";
  status: IncStatus; desc: string; action: string; notified: string[]; by: string; follow: string[];
}
export const INCIDENTS: Incident[] = [
  { id: "INC-041", type: "Fall", resident: "Kamala Silva", date: "Today · 07:40", location: "Bathroom, Onyx", severity: "High", status: "Under review", desc: "Found sitting on floor beside toilet. Alert, no loss of consciousness.", action: "Checked by nurse, vitals normal, bruise on left hip body-mapped.", notified: ["Guardian", "Manager", "Doctor"], by: "Ruwan Jayakody", follow: ["Doctor review today", "Falls risk reassessment", "Install grab rail"] },
  { id: "INC-040", type: "Medication", resident: "Sita Fernando", date: "Yesterday · 13:30", location: "Amber", severity: "Medium", status: "Action taken", desc: "Levodopa 13:30 dose missed (resident at physio).", action: "Dose given at 14:10 on return, doctor informed.", notified: ["Manager", "Doctor"], by: "Dilini Fernando", follow: ["Align physio time with doses"] },
  { id: "INC-039", type: "Illness", resident: "Fathima Rizwan", date: "04 Nov · 18:20", location: "Pearl", severity: "Medium", status: "Closed", desc: "Low-grade fever 37.9°C, reduced appetite.", action: "Fluids encouraged, GP review, antibiotics not required.", notified: ["Guardian"], by: "Anoma Perera", follow: [] },
  { id: "INC-038", type: "Behaviour", resident: "Sita Fernando", date: "03 Nov · 21:00", location: "Amber", severity: "Low", status: "Closed", desc: "Sundowning agitation, settled with music.", action: "Calming routine applied.", notified: [], by: "Malathi Rajan", follow: [] },
  { id: "INC-037", type: "Injury", resident: "Nimal Perera", date: "01 Nov · 10:15", location: "Garden", severity: "Low", status: "Closed", desc: "Minor graze on right forearm from garden bench.", action: "Cleaned and dressed.", notified: ["Guardian"], by: "Ruwan Jayakody", follow: [] },
  { id: "INC-036", type: "Other", resident: "Rajan Selvam", date: "30 Oct · 16:00", location: "Ivory", severity: "Low", status: "Action taken", desc: "Call pendant battery low alarm.", action: "Battery replaced, all pendants checked.", notified: ["Manager"], by: "Kasun Ranasinghe", follow: ["Monthly pendant check"] },
];

export interface Appt { id: string; resident: string; type: string; day: number; time: string; place: string; provider: string; staff: string; transport: string; notify: boolean; status: "Scheduled" | "Confirmed" | "Completed"; outcome?: string }
export const APPOINTMENTS: Appt[] = [
  { id: "ap1", resident: "Nimal Perera", type: "Cardiology", day: 0, time: "10:30", place: "Lanka Hospitals", provider: "Dr. Ratnam", staff: "Ruwan J.", transport: "Facility car", notify: true, status: "Confirmed" },
  { id: "ap2", resident: "Fathima Rizwan", type: "Physiotherapy", day: 0, time: "14:00", place: "On site", provider: "N. Joseph", staff: "—", transport: "None", notify: false, status: "Scheduled" },
  { id: "ap3", resident: "Kamala Silva", type: "GP review", day: 1, time: "09:00", place: "On site", provider: "Dr. Perera", staff: "Dilini F.", transport: "None", notify: true, status: "Confirmed" },
  { id: "ap4", resident: "Sita Fernando", type: "Neurology", day: 2, time: "11:00", place: "Nawaloka Hospital", provider: "Dr. Jayasekara", staff: "Malathi R.", transport: "Ambulance", notify: true, status: "Scheduled" },
  { id: "ap5", resident: "Rajan Selvam", type: "Eye clinic", day: 3, time: "15:30", place: "Asiri Surgical", provider: "Dr. Kumaran", staff: "Ruwan J.", transport: "Facility car", notify: false, status: "Scheduled" },
  { id: "ap6", resident: "Anura Jayasuriya", type: "Dietitian", day: 4, time: "10:00", place: "On site", provider: "H. Peiris", staff: "—", transport: "None", notify: false, status: "Scheduled" },
  { id: "ap7", resident: "Nimal Perera", type: "Bloods (HbA1c)", day: 5, time: "08:00", place: "On site", provider: "Lab pickup", staff: "Dilini F.", transport: "None", notify: true, status: "Scheduled" },
];

export interface Staff {
  id: string; name: string; role: string; dept: "Management" | "Nursing" | "Care" | "Wellness" | "Admin"; facility: string;
  phone: string; quals: string[]; training: { n: string; exp: string }[]; roster: string[];
}
// roster: M=morning E=evening N=night O=off L=leave
export const STAFF: Staff[] = [
  { id: "s1", name: "Ayesha Wijesinghe", role: "Director", dept: "Management", facility: "All", phone: "+94 77 100 0001", quals: ["MBBS", "Geriatrics"], training: [{ n: "Safeguarding", exp: "2027-03-01" }], roster: ["M", "M", "M", "M", "M", "O", "O"] },
  { id: "s2", name: "Kasun Ranasinghe", role: "Facility Manager", dept: "Management", facility: "House 1", phone: "+94 77 100 0002", quals: ["Operations"], training: [{ n: "Fire safety", exp: "2026-11-20" }], roster: ["M", "M", "M", "M", "M", "O", "O"] },
  { id: "s3", name: "Dilini Fernando", role: "Lead Nurse", dept: "Nursing", facility: "House 1", phone: "+94 77 100 0003", quals: ["Registered Nurse"], training: [{ n: "Medication", exp: "2027-01-15" }, { n: "First aid", exp: "2026-11-12" }], roster: ["M", "M", "M", "O", "O", "M", "M"] },
  { id: "s4", name: "Sanjeewa Kumar", role: "Registered Nurse", dept: "Nursing", facility: "House 2", phone: "+94 77 100 0004", quals: ["Registered Nurse", "Wound care"], training: [{ n: "Medication", exp: "2026-12-30" }], roster: ["E", "E", "O", "O", "E", "E", "E"] },
  { id: "s5", name: "Anoma Perera", role: "Night Nurse", dept: "Nursing", facility: "House 1", phone: "+94 77 100 0005", quals: ["Registered Nurse"], training: [{ n: "First aid", exp: "2026-10-30" }], roster: ["N", "N", "N", "O", "O", "N", "N"] },
  { id: "s6", name: "Nadeesha Silva", role: "Senior Caregiver", dept: "Care", facility: "House 1", phone: "+94 77 100 0006", quals: ["Dementia care"], training: [{ n: "Manual handling", exp: "2027-02-10" }], roster: ["M", "M", "O", "O", "M", "M", "M"] },
  { id: "s7", name: "Ruwan Jayakody", role: "Caregiver", dept: "Care", facility: "House 1", phone: "+94 77 100 0007", quals: ["First aid"], training: [{ n: "Manual handling", exp: "2026-11-25" }], roster: ["M", "M", "M", "M", "O", "O", "M"] },
  { id: "s8", name: "Malathi Rajan", role: "Night Supervisor", dept: "Care", facility: "House 2", phone: "+94 77 100 0008", quals: ["Safeguarding"], training: [{ n: "Safeguarding", exp: "2027-04-02" }], roster: ["N", "O", "N", "N", "N", "O", "L"] },
  { id: "s9", name: "Nirmala Joseph", role: "Physiotherapist", dept: "Wellness", facility: "All", phone: "+94 77 100 0009", quals: ["BSc Physiotherapy"], training: [{ n: "Manual handling", exp: "2027-01-05" }], roster: ["M", "M", "M", "M", "O", "O", "O"] },
  { id: "s10", name: "Hiruni Peiris", role: "Dietitian", dept: "Wellness", facility: "All", phone: "+94 77 100 0010", quals: ["Clinical nutrition"], training: [{ n: "Food safety", exp: "2026-12-01" }], roster: ["O", "M", "M", "M", "M", "O", "O"] },
  { id: "s11", name: "Tharushi Gunawardena", role: "Finance & Admissions", dept: "Admin", facility: "All", phone: "+94 77 100 0011", quals: ["Accounting"], training: [{ n: "Data protection", exp: "2027-03-20" }], roster: ["M", "M", "M", "M", "M", "O", "O"] },
  { id: "s12", name: "Dinesh Alwis", role: "Activities Coordinator", dept: "Wellness", facility: "House 2", phone: "+94 77 100 0012", quals: ["Recreation"], training: [{ n: "Safeguarding", exp: "2026-11-15" }], roster: ["M", "M", "M", "E", "E", "O", "O"] },
];
export const LEAVE = [
  { id: "l1", who: "Malathi Rajan", dates: "Sun 15 Nov", type: "Annual", status: "Approved" },
  { id: "l2", who: "Nadeesha Silva", dates: "20–22 Nov", type: "Annual", status: "Pending" },
  { id: "l3", who: "Ruwan Jayakody", dates: "18 Nov", type: "Medical", status: "Pending" },
];

export type Billing = "One-time" | "Daily" | "Weekly" | "Monthly" | "Annual" | "Usage-based";
export interface CatItem { id: string; name: string; category: string; facility: "All" | "House 1" | "House 2"; price: number; billing: Billing; tax: string; available: boolean; approval: boolean; icon: string; history: { date: string; price: number }[] }
export const CATALOGUE: CatItem[] = [
  { id: "c1", name: "Essential 60 · Standard room", category: "Accommodation", facility: "All", price: 175000, billing: "Monthly", tax: "Exempt", available: true, approval: false, icon: "BedDouble", history: [{ date: "Jan 2026", price: 165000 }] },
  { id: "c2", name: "Comfort 60 · Premium room", category: "Accommodation", facility: "All", price: 235000, billing: "Monthly", tax: "Exempt", available: true, approval: false, icon: "BedDouble", history: [{ date: "Jan 2026", price: 220000 }] },
  { id: "c3", name: "Platinum 60 · Suite", category: "Accommodation", facility: "House 2", price: 345000, billing: "Monthly", tax: "Exempt", available: true, approval: true, icon: "Crown", history: [] },
  { id: "c4", name: "Couple package", category: "Accommodation", facility: "All", price: 297500, billing: "Monthly", tax: "Exempt", available: true, approval: true, icon: "Users", history: [] },
  { id: "c5", name: "Air conditioning", category: "Room upgrades", facility: "All", price: 18000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "Snowflake", history: [{ date: "Mar 2026", price: 16000 }] },
  { id: "c6", name: "Orthopaedic mattress", category: "Room upgrades", facility: "All", price: 9000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "BedSingle", history: [] },
  { id: "c7", name: "Adjustable electric bed", category: "Room upgrades", facility: "House 1", price: 24000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "BedDouble", history: [] },
  { id: "c8", name: "Room refrigerator", category: "Room upgrades", facility: "All", price: 6000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "Refrigerator", history: [] },
  { id: "c9", name: "Additional laundry", category: "Personal services", facility: "All", price: 9000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "Shirt", history: [] },
  { id: "c10", name: "Concierge (Platinum 60)", category: "Personal services", facility: "House 2", price: 60000, billing: "Monthly", tax: "VAT 18%", available: true, approval: true, icon: "Crown", history: [] },
  { id: "c11", name: "Physiotherapy session", category: "Wellbeing", facility: "All", price: 4500, billing: "Usage-based", tax: "Exempt", available: true, approval: false, icon: "Activity", history: [] },
  { id: "c12", name: "Private transport", category: "Wellbeing", facility: "All", price: 6500, billing: "Usage-based", tax: "VAT 18%", available: true, approval: false, icon: "Car", history: [] },
  { id: "c13", name: "Premium laundry plan", category: "Subscriptions", facility: "All", price: 12000, billing: "Monthly", tax: "VAT 18%", available: true, approval: false, icon: "Repeat", history: [] },
  { id: "c14", name: "Entertainment package", category: "Subscriptions", facility: "All", price: 3500, billing: "Monthly", tax: "VAT 18%", available: false, approval: false, icon: "Tv", history: [] },
  { id: "c15", name: "Registration fee", category: "Accommodation", facility: "All", price: 25000, billing: "One-time", tax: "Exempt", available: true, approval: true, icon: "FileCheck", history: [] },
];

export type InvStatus = "Paid" | "Due" | "Overdue" | "Partial";
export interface Invoice { id: string; resident: string; guardian: string; month: string; room: number; addons: number; total: number; paid: number; status: InvStatus; due: string; facility: string }
export const INVOICES: Invoice[] = [
  { id: "INV-1108", resident: "Nimal Perera", guardian: "Sunil Perera", month: "Nov 2026", room: 185000, addons: 24000, total: 209000, paid: 209000, status: "Paid", due: "05 Nov", facility: "House 1" },
  { id: "INV-1109", resident: "Kamala Silva", guardian: "Nadeesha Silva", month: "Nov 2026", room: 195000, addons: 38000, total: 233000, paid: 0, status: "Due", due: "10 Nov", facility: "House 1" },
  { id: "INV-1110", resident: "Rajan Selvam", guardian: "Priya Selvam", month: "Nov 2026", room: 175000, addons: 0, total: 175000, paid: 175000, status: "Paid", due: "05 Nov", facility: "House 1" },
  { id: "INV-1111", resident: "Fathima Rizwan", guardian: "Imran Rizwan", month: "Nov 2026", room: 190000, addons: 56000, total: 246000, paid: 120000, status: "Partial", due: "05 Nov", facility: "House 2" },
  { id: "INV-1112", resident: "Sita Fernando", guardian: "Dilan Fernando", month: "Nov 2026", room: 200000, addons: 82000, total: 282000, paid: 0, status: "Due", due: "10 Nov", facility: "House 2" },
  { id: "INV-1113", resident: "Anura Jayasuriya", guardian: "Chamari Jayasuriya", month: "Nov 2026", room: 220000, addons: 18000, total: 238000, paid: 238000, status: "Paid", due: "05 Nov", facility: "House 2" },
  { id: "INV-1098", resident: "Kamala Silva", guardian: "Nadeesha Silva", month: "Oct 2026", room: 195000, addons: 38000, total: 233000, paid: 150000, status: "Overdue", due: "05 Oct", facility: "House 1" },
  { id: "INV-1099", resident: "Sita Fernando", guardian: "Dilan Fernando", month: "Oct 2026", room: 200000, addons: 76000, total: 276000, paid: 276000, status: "Paid", due: "05 Oct", facility: "House 2" },
];
export const SUBSCRIPTIONS = [
  { id: "sb1", resident: "Nimal Perera", item: "Premium laundry plan", price: 12000, next: "01 Dec", status: "Active" },
  { id: "sb2", resident: "Kamala Silva", item: "Concierge (Platinum 60)", price: 60000, next: "01 Dec", status: "Active" },
  { id: "sb3", resident: "Fathima Rizwan", item: "Entertainment package", price: 3500, next: "01 Dec", status: "Renewal due" },
  { id: "sb4", resident: "Sita Fernando", item: "Premium laundry plan", price: 12000, next: "01 Dec", status: "Active" },
];
export const APPROVALS = [
  { id: "ad1", type: "Discount", what: "10% loyalty discount — Rajan Selvam", amount: 17500, by: "Tharushi G." },
  { id: "ad2", type: "Refund", what: "Unused physio sessions — Kamala Silva", amount: 9000, by: "Tharushi G." },
  { id: "ad3", type: "Write-off", what: "Small balance — Oct invoice INV-1087", amount: 1500, by: "Kasun R." },
];
export const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
export const REVENUE: Record<string, number[]> = {
  "House 1": [820, 850, 870, 860, 905, 930, 945],
  "House 2": [610, 640, 655, 690, 720, 760, 790],
};

export interface Notif { id: string; pri: "Critical" | "High" | "Normal"; title: string; when: string; mod: string; href: string; ack: boolean }
export const NOTIFS: Notif[] = [
  { id: "n1", pri: "Critical", title: "Assistance request unacknowledged — Amber", when: "2 min ago", mod: "Smart room", href: "/app/smart-room", ack: false },
  { id: "n2", pri: "Critical", title: "Fall reported — Kamala Silva (Onyx)", when: "Today 07:40", mod: "Incidents", href: "/app/incidents", ack: false },
  { id: "n3", pri: "High", title: "Medication overdue — Levodopa, Sita Fernando", when: "Today 13:30", mod: "Medication", href: "/app/medication", ack: false },
  { id: "n4", pri: "High", title: "Invoice overdue — INV-1098 Kamala Silva", when: "Yesterday", mod: "Billing", href: "/app/finance", ack: false },
  { id: "n5", pri: "High", title: "Training expired — First aid (Anoma Perera)", when: "Yesterday", mod: "Staff", href: "/app/staff", ack: false },
  { id: "n6", pri: "Normal", title: "Care plan review due — Fathima Rizwan", when: "In 2 days", mod: "Residents", href: "/app/residents", ack: false },
  { id: "n7", pri: "Normal", title: "Guardian message — Sunil Perera", when: "Today 09:12", mod: "Messages", href: "/app/family", ack: false },
  { id: "n8", pri: "Normal", title: "Opal maintenance: air conditioning", when: "Today", mod: "Rooms", href: "/app/rooms", ack: true },
];

export const HOMECARE = [
  { id: "hc1", name: "Valli Kumar", area: "Nugegoda", pkg: "Daily 4h", days: "Mon–Sat", carer: "Ruwan J.", access: "Key safe, code via manager", pets: "Cat", equip: "Walking frame, shower chair", visits: [
    { d: "Today", t: "08:00–12:00", carer: "Ruwan J.", status: "In progress", tasks: ["Bathing", "Breakfast", "Medication prompt"] },
    { d: "Yesterday", t: "08:00–12:00", carer: "Ruwan J.", status: "Completed", tasks: ["Bathing", "Meals", "Walk"] } ] },
  { id: "hc2", name: "Gamini Dissanayake", area: "Rajagiriya", pkg: "Visits ×3 / week", days: "Mon · Wed · Fri", carer: "Nadeesha S.", access: "Daughter present", pets: "None", equip: "Wheelchair", visits: [
    { d: "Today", t: "14:00–16:00", carer: "Nadeesha S.", status: "Scheduled", tasks: ["Exercise", "Meal prep"] },
    { d: "Wed", t: "14:00–16:00", carer: "Nadeesha S.", status: "Completed", tasks: ["Exercise", "Shopping"] } ] },
  { id: "hc3", name: "Leela Perera", area: "Mount Lavinia", pkg: "Overnight ×2", days: "Fri · Sat", carer: "Malathi R.", access: "Neighbour holds key", pets: "Dog", equip: "Bed rails", visits: [
    { d: "Fri", t: "20:00–06:00", carer: "Malathi R.", status: "Scheduled", tasks: ["Night checks", "Toileting"] } ] },
];

export const PHARMACY = [
  { id: "ph1", resident: "Nimal Perera", items: "Metformin ×60, Amlodipine ×30", status: 2, eta: "Delivered 09:40" },
  { id: "ph2", resident: "Sita Fernando", items: "Levodopa ×90", status: 1, eta: "ETA 15:30" },
  { id: "ph3", resident: "Fathima Rizwan", items: "Atorvastatin ×30", status: 0, eta: "Order placed" },
];

export const USERS = [
  { id: "u1", name: "Ayesha Wijesinghe", email: "director@village60.lk", role: "Director", mfa: true, active: true, last: "Today 07:52" },
  { id: "u2", name: "Kasun Ranasinghe", email: "manager@village60.lk", role: "Facility Manager", mfa: true, active: true, last: "Today 08:05" },
  { id: "u3", name: "Dilini Fernando", email: "nurse@village60.lk", role: "Nursing", mfa: false, active: true, last: "Today 06:58" },
  { id: "u4", name: "Ruwan Jayakody", email: "carer@village60.lk", role: "Caregiver", mfa: false, active: true, last: "Today 07:01" },
  { id: "u5", name: "Tharushi Gunawardena", email: "finance@village60.lk", role: "Finance", mfa: true, active: true, last: "Yesterday" },
  { id: "u6", name: "Sunil Perera", email: "sunil@family.lk", role: "Guardian", mfa: false, active: true, last: "Today 09:12" },
  { id: "u7", name: "Imran Rizwan", email: "imran@family.lk", role: "Guardian", mfa: false, active: false, last: "Invited" },
];

export interface AuditEntry { id: string; who: string; action: string; target: string; when: string; ai?: boolean }
export const AUDIT_SEED: AuditEntry[] = [
  { id: "x1", who: "Dilini Fernando", action: "Recorded medication given", target: "Nimal Perera · Metformin 08:00", when: "Today 08:02" },
  { id: "x2", who: "SAGE", action: "Prepared shift handover draft", target: "House 1 · Day shift", when: "Today 06:55", ai: true },
  { id: "x3", who: "Tharushi Gunawardena", action: "Recorded payment LKR 209,000", target: "INV-1108", when: "Today 08:40" },
  { id: "x4", who: "Kasun Ranasinghe", action: "Approved admission step: Agreement", target: "Lalith Fernando", when: "Yesterday 16:20" },
  { id: "x5", who: "Ayesha Wijesinghe", action: "Changed catalogue price", target: "Air conditioning 16,000 → 18,000 (new agreements only)", when: "Mar 2026" },
];

export const SAGE_QUEUE = [
  { id: "q1", kind: "Quotation", title: "Quotation for Lalith Fernando — Coral, Comfort 60 + AC", detail: "LKR 253,000 / month · 12-month term", for: "Manager approval" },
  { id: "q2", kind: "Guardian message", title: "Update to Sunil Perera about Friday cardiology visit", detail: "“Nimal will be escorted to Lanka Hospitals at 10:30…”", for: "Manager approval" },
  { id: "q3", kind: "Incident summary", title: "INC-041 summary for Dr. Perera", detail: "Fall in bathroom, vitals normal, hip bruise body-mapped", for: "Nurse approval" },
];
