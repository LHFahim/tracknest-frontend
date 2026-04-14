import { IRoute } from "@/types";

/** Sidebar routes for Staff (panelType: "STAFF") */
export const staffRoutes: IRoute[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/dashboard/users" },
      { title: "Categories", url: "/dashboard/categories" },
      { title: "All Items", url: "/items" },
    ],
  },
  {
    title: "Reports",
    items: [
      { title: "View Reports", url: "/dashboard/reports" },
    ],
  },
];
