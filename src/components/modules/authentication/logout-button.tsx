"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarMenuButton onClick={handleLogout} disabled={isLoading}>
      <LogOut />
      <span>{isLoading ? "Logging out..." : "Log out"}</span>
    </SidebarMenuButton>
  );
}
