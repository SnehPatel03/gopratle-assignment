export type Category = "planner" | "performer" | "crew";

export type Requirement = {
  _id: string;
  requirementId: string;
  category: Category;
  event: {
    name: string;
    type: string;
    startDate: string;
    endDate: string;
    location: string;
    venue: string;
  };
  budget: { amount: number; flexible?: boolean };
  additionalRequirements?: string;
  status: string;
  createdAt: string;
  categoryDetails?: Record<string, unknown>;
};

export type Values = {
  category: Category;
  name: string;
  type: string;
  typeOther: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  amount: number;
  flexible: boolean;
  notes: string;
  services: string;
  servicesOther: string;
  guestCount: number;
  eventScale: string;
  experienceLevel: string;
  performanceType: string;
  performanceTypeOther: string;
  genre: string;
  genreOther: string;
  performersCount: number;
  durationMinutes: number;
  equipment: string;
  role: string;
  roleOther: string;
  crewCount: number;
  experience: string;
  workingHours: number;
};

export type WorkspaceProps = {
  page?: "form" | "list" | "detail";
  requirementId?: string;
};

export const categoryOptions = [
  { id: "planner", title: "Planner", text: "Plan the event", image: "/illustrations/1.svg" },
  { id: "crew", title: "Crew", text: "Find event support", image: "/illustrations/2.svg" },
  { id: "performer", title: "Performer", text: "Find an act", image: "/illustrations/3.svg" },
] as const;

export const eventTypes = [
  "Wedding", "Corporate event", "Birthday celebration",
  "Concert / show", "Private dinner", "Other",
];

export const serviceOptions = [
  "Full planning", "Décor & styling", "Catering",
  "Venue coordination", "Other",
];

export const scales = [
  "Intimate (under 50)", "Medium (50–150)",
  "Large (150–500)", "Grand (500+)",
];

export const experienceOptions = [
  "Emerging talent", "Established professional", "Premium specialist",
];

export const performanceOptions = [
  "DJ", "Live band", "Singer", "Dance act", "Host / emcee", "Other",
];

export const genres = ["Bollywood", "Classical", "Jazz", "Pop", "Electronic", "Other"];

export const crewRoles = [
  "Sound engineer", "Lighting technician", "Stage manager",
  "Photographer", "Videographer", "Other",
];

export const resolveOther = (value: string, other: string) =>
  value === "Other" ? other.trim() : value;