"use client";

import { withdrawClaim } from "@/actions/claims.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function WithdrawClaimButton({ claimId }: { claimId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw this claim?")) return;
    setLoading(true);
    const toastId = toast.loading("Withdrawing claim…");
    try {
      const res = await withdrawClaim(claimId);
      if (res.error) {
        toast.error(res.error.message, { id: toastId });
      } else {
        toast.success("Claim withdrawn.", { id: toastId });
        router.push("/dashboard/my-claims");
      }
    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleWithdraw}
      disabled={loading}
      className="shrink-0"
    >
      {loading ? "Withdrawing…" : "Withdraw"}
    </Button>
  );
}
