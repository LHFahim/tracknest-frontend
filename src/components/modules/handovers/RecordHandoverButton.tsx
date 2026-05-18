"use client";

import { createHandover } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RecordHandoverButton({
  foundItemId,
  receivedByUserId,
}: {
  foundItemId: string;
  receivedByUserId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const toastId = toast.loading("Recording handover…");
    try {
      const res = await createHandover({
        foundItem: foundItemId,
        receivedByUser: receivedByUserId,
        note: note || undefined,
      });

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Handover recorded successfully", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (showNote) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note…"
          className="rounded-lg border border-input bg-background px-2 py-1 text-xs w-36 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button size="sm" onClick={handleSubmit} disabled={loading}>
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowNote(false)} disabled={loading}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={() => setShowNote(true)} disabled={loading}>
      Record Handover
    </Button>
  );
}
