import { IRoute } from "@/types";

export const adminRoutes: IRoute[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard" },
      { title: "Analytics", url: "/dashboard/analytics" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/dashboard/users" },
      { title: "Categories", url: "/dashboard/categories" },
    ],
  },
  {
    title: "Lost & Found",
    items: [
      { title: "All Items", url: "/items" },
      { title: "Smart Matching", url: "/dashboard/matching" },
      { title: "Claims Review", url: "/dashboard/claims" },
      { title: "Handovers", url: "/dashboard/handovers" },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Edit Profile", url: "/dashboard/profile" }],
  },
];