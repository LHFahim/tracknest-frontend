import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = await userService.getSession();
  const isLoggedIn = !!data?.user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} />
      <main>{children}</main>
    </div>
  );
}
