"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
