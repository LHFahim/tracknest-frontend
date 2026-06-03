import { IRoute } from "@/types";

export const staffRoutes: IRoute[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard" }],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/dashboard/users" },
      { title: "Categories", url: "/dashboard/categories" },
      { title: "All Items", url: "/items" },
      { title: "Report Found Item", url: "/dashboard/report-found" },
    ],
  },
  {
    title: "Lost & Found",
    items: [
      { title: "AI Matching Assistant", url: "/dashboard/ai-matching" },
      { title: "Claims Review", url: "/dashboard/claims" },
      { title: "Handovers", url: "/dashboard/handovers" },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Edit Profile", url: "/dashboard/profile" }],
  },
];