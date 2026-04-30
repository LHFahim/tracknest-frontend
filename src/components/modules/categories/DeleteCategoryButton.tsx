"use client";

import { deleteCategory } from "@/actions/category.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
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
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Delete &quot;{name}&quot;?</span>
      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          const toastId = toast.loading("Deleting category…");
          const res = await deleteCategory(id);
          if (res.error) {
            toast.error(res.error.message, { id: toastId });
          } else {
            toast.success("Category deleted", { id: toastId });
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
