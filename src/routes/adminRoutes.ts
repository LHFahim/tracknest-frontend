import { IRoute } from "@/types";

/** Sidebar routes for SuperAdmin (panelType: "ADMIN") */
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
      { title: "Claims Review", url: "/dashboard/claims" },
      { title: "Handovers", url: "/dashboard/handovers" },
    ],
  },
];
