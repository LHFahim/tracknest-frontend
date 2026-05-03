import { IRoute } from "@/types";

/** Sidebar routes for regular Users (panelType: "USER") */
export const userRoutes: IRoute[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard" },
    ],
  },
  {
    title: "Items",
    items: [
      { title: "Browse All Items", url: "/items" },
      { title: "Report Lost Item", url: "/dashboard/report-lost" },
      { title: "Report Found Item", url: "/dashboard/report-found" },
      { title: "My Claims", url: "/dashboard/my-claims" },
    ],
  },
  {
    title: "My Activity",
    items: [
      { title: "My Lost Reports", url: "/dashboard/my-lost-items" },
      { title: "My Found Reports", url: "/dashboard/my-found-items" },
      { title: "My Handovers", url: "/dashboard/my-handovers" },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Edit Profile", url: "/dashboard/profile" },
    ],
  },
];
