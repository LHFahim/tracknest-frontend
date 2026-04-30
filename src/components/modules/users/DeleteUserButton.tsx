"use client";

import { deleteUser } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setConfirming(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground">
        Delete &quot;{userName}&quot;?
      </span>
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          const toastId = toast.loading("Deleting user…");
          const res = await deleteUser(userId);
          if (res.error) {
            toast.error(res.error.message, { id: toastId });
          } else {
            toast.success("User deleted", { id: toastId });
            router.refresh();
          }
          setConfirming(false);
        }}
      >
        Confirm
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
    </div>
  );
}
