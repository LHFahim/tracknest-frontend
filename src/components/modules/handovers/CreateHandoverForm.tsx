"use client";

import { createHandover } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IClaim } from "@/types/claim.interface";
import { IFoundItem } from "@/types/item.interface";
import { IUser } from "@/types/user.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  foundItem: z.string().min(1, "Please select a found item"),
  receivedByUser: z.string().min(1, "Recipient is required"),
  note: z.string(),
});

interface CreateHandoverFormProps {
  foundItems: IFoundItem[];
  approvedClaims: IClaim[];
  users: IUser[];
  onSuccess?: () => void;
}

export function CreateHandoverForm({ foundItems, approvedClaims, users, onSuccess }: CreateHandoverFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFoundItemId, setSelectedFoundItemId] = useState("");

  const form = useForm({
    defaultValues: { foundItem: "", receivedByUser: "", note: "" },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Recording handover…");
      try {
        const res = await createHandover({
          foundItem: value.foundItem,
          receivedByUser: value.receivedByUser,
          note: value.note || undefined,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Handover recorded successfully", { id: toastId });
        form.reset();
        setOpen(false);
        setSelectedFoundItemId("");
        if (onSuccess) onSuccess();
        else router.refresh();
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Record Handover</Button>;
  }

  // Find the approved claim for the selected found item
  const approvedClaim = approvedClaims.find((c) => c.foundItemId === selectedFoundItemId);
  const claimant = approvedClaim ? users.find((u) => u.id === approvedClaim.claimedBy) : null;

  const selectClass =
    "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm w-full max-w-md">
      <h3 className="text-base font-semibold mb-4">Record New Handover</h3>
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="space-y-4"
      >
        <FieldGroup>
          {/* Found Item dropdown */}
          <form.Field name="foundItem">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Found Item *</FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      const itemId = e.target.value;
                      field.handleChange(itemId);
                      setSelectedFoundItemId(itemId);
                      // Auto-fill recipient from approved claim
                      const claim = approvedClaims.find((c) => c.foundItemId === itemId);
                      form.setFieldValue("receivedByUser", claim?.claimedBy ?? "");
                    }}
                    className={selectClass}
                  >
                    <option value="">Select a found item…</option>
                    {foundItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {item.status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Recipient - auto-filled from approved claim */}
          <form.Field name="receivedByUser">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Recipient *</FieldLabel>
                  {selectedFoundItemId && claimant ? (
                    // Auto-filled from approved claim - show as read-only
                    <div className={`${selectClass} bg-muted/40 cursor-not-allowed`}>
                      {claimant.firstName} {claimant.lastName} — {claimant.email}
                      <input type="hidden" value={claimant.id} />
                    </div>
                  ) : selectedFoundItemId && !approvedClaim ? (
                    // Item selected but no approved claim found
                    <p className="text-sm text-destructive">
                      No approved claim found for this item. Approve a claim first.
                    </p>
                  ) : (
                    // No item selected yet
                    <div className={`${selectClass} bg-muted/40 text-muted-foreground cursor-not-allowed`}>
                      Select a found item first…
                    </div>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Note */}
          <form.Field name="note">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Note <span className="text-muted-foreground font-normal">(optional)</span>
                </FieldLabel>
                <input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Any additional notes about the handover"
                  className={selectClass}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex gap-3 pt-1">
          <Button type="submit" disabled={!approvedClaim} className="flex-1">
            Record Handover
          </Button>
          <Button type="button" variant="outline" onClick={() => { form.reset(); setOpen(false); setSelectedFoundItemId(""); }}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
