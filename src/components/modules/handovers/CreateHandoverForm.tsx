"use client";

import { createHandover } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const mongoIdRegex = /^[a-f\d]{24}$/i;

const formSchema = z.object({
  foundItem: z
    .string()
    .min(1, "Found item ID is required")
    .refine((v) => mongoIdRegex.test(v), { message: "Must be a valid MongoDB ID" }),
  receivedByUser: z
    .string()
    .min(1, "Recipient user ID is required")
    .refine((v) => mongoIdRegex.test(v), { message: "Must be a valid MongoDB ID" }),
  note: z.string(),
});

interface CreateHandoverFormProps {
  onSuccess?: () => void;
}

export function CreateHandoverForm({ onSuccess }: CreateHandoverFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      foundItem: "",
      receivedByUser: "",
      note: "",
    },
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
    return (
      <Button onClick={() => setOpen(true)}>Record Handover</Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-4">Record New Handover</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          {/* Found Item ID */}
          <form.Field name="foundItem">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Found Item ID *</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="MongoDB ObjectId of the found item"
                    className="font-mono text-xs"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Received By User ID */}
          <form.Field name="receivedByUser">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Recipient User ID *</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="MongoDB ObjectId of the user receiving the item"
                    className="font-mono text-xs"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Note */}
          <form.Field name="note">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Note{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Any additional notes about the handover"
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex gap-3 pt-1">
          <Button type="submit" className="flex-1">
            Record Handover
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
