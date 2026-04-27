"use client";

import { createClaim } from "@/actions/claims.action";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const schema = z.object({
  message: z.string().min(10, "Please describe why this item is yours (min 10 chars)"),
});

interface ClaimButtonProps {
  foundItemId: string;
  itemTitle: string;
}

export function ClaimButton({ foundItemId, itemTitle }: ClaimButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { message: "" },
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting claim…");
      try {
        const res = await createClaim({
          foundItemId,
          message: value.message,
          images: [],
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Claim submitted! You'll be notified of updates.", {
          id: toastId,
        });
        setOpen(false);
      } catch {
        toast.error("Something went wrong.", { id: toastId });
      }
    },
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Claim This Item
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-foreground">
        Claim: {itemTitle}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Explain why this item belongs to you. Be specific — staff will review your claim.
      </p>

      <form
        id="claim-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="message">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Your message *</FieldLabel>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    placeholder="e.g. This is my laptop — it has a sticker of a red car on the lid and my name written inside the battery compartment…"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  {isInvalid && (
                    <p className="text-xs text-destructive mt-1">
                      {field.state.meta.errors
                        .map((e) =>
                          typeof e === "string" ? e : (e as { message?: string })?.message
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </form>

      <div className="mt-4 flex gap-3">
        <Button form="claim-form" type="submit" className="flex-1">
          Submit Claim
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpen(false);
            form.reset();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
