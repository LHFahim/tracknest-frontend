"use client";

import { createHandover } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IFoundItem } from "@/types/item.interface";
import { IUser } from "@/types/user.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  foundItem: z.string().min(1, "Please select a found item"),
  receivedByUser: z.string().min(1, "Please select a recipient"),
  note: z.string(),
});

interface CreateHandoverFormProps {
  foundItems: IFoundItem[];
  users: IUser[];
  onSuccess?: () => void;
}

export function CreateHandoverForm({ foundItems, users, onSuccess }: CreateHandoverFormProps) {
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

  const selectedItem = foundItems.find((i) => i.id === selectedFoundItemId);
  const eligibleUsers = selectedItem
    ? users.filter((u) => u.id !== selectedItem.foundBy)
    : users;

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
                      field.handleChange(e.target.value);
                      setSelectedFoundItemId(e.target.value);
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

          {/* Recipient dropdown */}
          <form.Field name="receivedByUser">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Recipient *</FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select a user…</option>
                    {eligibleUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} — {user.email}
                      </option>
                    ))}
                  </select>
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
          <Button type="submit" className="flex-1">Record Handover</Button>
          <Button type="button" variant="outline" onClick={() => { form.reset(); setOpen(false); }}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
