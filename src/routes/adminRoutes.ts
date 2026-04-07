import { IRoute } from "@/types";

export const adminRoutes: IRoute[] = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Analytics",
        url: "/admin-dashboard/analytics",
      },
      { title: "Users", url: "/admin-dashboard/users" },
    ],
  },
  {
    title: "Lost & Found",
    items: [
      { title: "All Items", url: "/items" },
    ],
  },
];
