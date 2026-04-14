import * as React from "react";

import { LogoutButton } from "@/components/modules/authentication/logout-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RolesEnum } from "@/constants/role";
import { adminRoutes } from "@/routes/adminRoutes";
import { staffRoutes } from "@/routes/staffRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { IRoute } from "@/types";
import Link from "next/link";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    role: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  let routes: IRoute[] = [];
  let roleLabel = "";

  switch (user.role) {
    case RolesEnum.ADMIN:
      routes = adminRoutes;
      roleLabel = "Super Admin";
      break;
    case RolesEnum.STAFF:
      routes = staffRoutes;
      roleLabel = "Staff";
      break;
    case RolesEnum.USER:
    default:
      routes = userRoutes;
      roleLabel = "User";
      break;
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user.email ?? "User");

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground">{roleLabel}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
