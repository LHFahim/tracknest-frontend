"use client";

import { reviewClaim } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClaimStatus } from "@/types/claim.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewClaimButtonProps {
  claimId: string;
  currentStatus: ClaimStatus;
}

const reviewableStatuses = [
  { value: ClaimStatus.UNDER_REVIEW, label: "Mark Under Review" },
  { value: ClaimStatus.APPROVED, label: "Approve" },
  { value: ClaimStatus.REJECTED, label: "Reject" },
];

export function ReviewClaimButton({
  claimId,
  currentStatus,
}: ReviewClaimButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const router = useRouter();

  const isTerminal =
    currentStatus === ClaimStatus.APPROVED ||
    currentStatus === ClaimStatus.REJECTED ||
    currentStatus === ClaimStatus.CANCELED;

  if (isTerminal) return null;

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Review
      </Button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">Update claim status</p>

      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>
        <SelectContent>
          {reviewableStatuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment for the claimant (optional)"
        rows={2}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!selectedStatus}
          onClick={async () => {
            const toastId = toast.loading("Updating claim…");
            const res = await reviewClaim(claimId, {
              status: selectedStatus,
              reviewComment: comment || undefined,
            });
            if (res.error) {
              toast.error(res.error.message, { id: toastId });
            } else {
              toast.success("Claim updated", { id: toastId });
              setOpen(false);
              router.refresh();
            }
          }}
        >
          Submit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setSelectedStatus("");
            setComment("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
