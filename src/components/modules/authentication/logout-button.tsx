"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
    } finally {
      redirect("/login");
    }
  };

  return (
    <SidebarMenuButton onClick={handleLogout} disabled={isLoading}>
      <LogOut />
      <span>{isLoading ? "Logging out..." : "Log out"}</span>
    </SidebarMenuButton>
  );
}
