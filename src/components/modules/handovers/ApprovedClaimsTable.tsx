"use client";

import { createHandover } from "@/actions/admin.action";
import { updateFoundItemStatus } from "@/actions/items.action";
import { Button } from "@/components/ui/button";
import { IClaim } from "@/types/claim.interface";
import { FoundItemStatus, IFoundItem } from "@/types/item.interface";
import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  claims: IClaim[];
  foundItemsMap: Record<string, IFoundItem>;
  usersMap: Record<string, IUser>;
}

export function ApprovedClaimsTable({ claims, foundItemsMap, usersMap }: Props) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(claims);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);

  const handleConfirm = async (claim: IClaim) => {
    setLoadingId(claim.id);
    const toastId = toast.loading("Recording handover…");
    try {
      const res = await createHandover({
        foundItem: claim.foundItemId,
        receivedByUser: claim.claimedBy,
        note: noteMap[claim.id] || undefined,
      });

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      // Mark the found item as RETURNED in the DB
      const statusRes = await updateFoundItemStatus(claim.foundItemId, FoundItemStatus.RETURNED);
      if (statusRes.error) {
        toast.warning(`Handover recorded, but item status update failed: ${statusRes.error.message}`, { id: toastId });
      } else {
        toast.success("Handover recorded successfully", { id: toastId });
      }
      setRemaining((prev) => prev.filter((c) => c.id !== claim.id));
      setShowNoteFor(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  if (remaining.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No approved claims awaiting handover.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Found Item</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Claimant</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Claim Message</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {remaining.map((claim, i) => {
            const foundItem = foundItemsMap[claim.foundItemId];
            const claimant = usersMap[claim.claimedBy];
            const isLoading = loadingId === claim.id;
            const isShowingNote = showNoteFor === claim.id;

            return (
              <tr key={claim.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3 font-medium">
                  {foundItem?.title ?? claim.foundItemId}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {claimant ? `${claimant.firstName} ${claimant.lastName}` : claim.claimedBy}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                  {claim.message}
                </td>
                <td className="px-4 py-3 text-right">
                  {isShowingNote ? (
                    <div className="flex items-center gap-2 justify-end">
                      <input
                        value={noteMap[claim.id] ?? ""}
                        onChange={(e) => setNoteMap((prev) => ({ ...prev, [claim.id]: e.target.value }))}
                        placeholder="Optional note…"
                        className="rounded-lg border border-input bg-background px-2 py-1 text-xs w-36 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <Button size="sm" onClick={() => handleConfirm(claim)} disabled={isLoading}>
                        {isLoading ? "Saving…" : "Confirm"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowNoteFor(null)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setShowNoteFor(claim.id)} disabled={isLoading}>
                      Record Handover
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
