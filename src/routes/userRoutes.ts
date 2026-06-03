import { IRoute } from "@/types";

export const userRoutes: IRoute[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard" }],
  },
  {
    title: "Items",
    items: [
      { title: "Browse All Items", url: "/items" },
      { title: "Report Lost Item", url: "/dashboard/report-lost" },
      { title: "My Claims", url: "/dashboard/my-claims" },
    ],
  },
  {
    title: "My Activity",
    items: [
      { title: "My Lost Reports", url: "/dashboard/my-lost-items" },
      { title: "My Handovers", url: "/dashboard/my-handovers" },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Edit Profile", url: "/dashboard/profile" }],
  },
];