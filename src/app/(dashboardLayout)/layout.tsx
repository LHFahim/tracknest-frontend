import Link from "next/link";
import { redirect } from "next/navigation";
import { Home } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/layout/modeToggle";
import SignOutButton from "@/components/layout/SignOutButton";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const userInfo = data?.user;

  if (!userInfo) {
    redirect("/login");
  }

  const displayName =
    userInfo.firstName || userInfo.lastName
      ? `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`.trim()
      : userInfo.email ?? "User";

  const userRole = userInfo.role ?? userInfo.panelType ?? "NORMAL_USER";

  const roleLabel =
    userRole === "ADMIN" ? "Admin" : userRole === "STAFF" ? "Staff" : "User";

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />

      <SidebarInset className="bg-muted/20">
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="hidden h-6 sm:block" />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                TrackNest Dashboard
              </p>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Lost & Found Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted md:flex"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <ModeToggle />

            <div className="hidden items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm lg:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="max-w-36">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>

            <SignOutButton />
          </div>
        </header>

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}