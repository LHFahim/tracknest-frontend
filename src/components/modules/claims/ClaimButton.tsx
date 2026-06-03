"use client";

import { createClaim } from "@/actions/claims.action";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const schema = z.object({
  lostItemId: z.string().min(1, "Please select which of your lost items this is"),
  message: z.string().min(10, "Please describe why this item is yours (min 10 chars)"),
});

interface ClaimButtonProps {
  foundItemId: string;
  itemTitle: string;
  myLostItems?: { id: string; title: string }[];
}

const STORAGE_KEY = "claimed_items";

function getClaimedItems(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

function markItemClaimed(id: string) {
  const items = getClaimedItems();
  if (!items.includes(id)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, id]));
}

export function ClaimButton({ foundItemId, itemTitle, myLostItems = [] }: ClaimButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    setClaimed(getClaimedItems().includes(foundItemId));
  }, [foundItemId]);

  const form = useForm({
    defaultValues: { lostItemId: "", message: "" },
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting claim…");
      try {
        const res = await createClaim({
          foundItemId,
          message: value.message,
          images: [],
          lostItemId: value.lostItemId,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Claim submitted! You'll be notified of updates.", { id: toastId });
        setOpen(false);
        setClaimed(true);
        markItemClaimed(foundItemId);
        router.refresh();
      } catch {
        toast.error("Something went wrong.", { id: toastId });
      }
    },
  });

  if (claimed) {
    return (
      <Button variant="outline" disabled className="w-full sm:w-auto">
        Claim Submitted
      </Button>
    );
  }

  // User hasn't reported any lost items yet — block claim
  if (!open && myLostItems.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="font-medium">Lost item report required</p>
        <p className="mt-1 text-xs">
          To claim a found item you must first{" "}
          <Link href="/dashboard/report-lost" className="underline underline-offset-2 font-semibold">
            report your item as lost
          </Link>
          . This helps staff verify ownership.
        </p>
      </div>
    );
  }

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
        Select your lost item report and explain why this is yours. Staff will cross-check your report.
      </p>

      <form
        id="claim-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Lost item selector */}
          <form.Field name="lostItemId">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Your lost item report *</FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">— Select a lost item report —</option>
                    {myLostItems.map((li) => (
                      <option key={li.id} value={li.id}>
                        {li.title}
                      </option>
                    ))}
                  </select>
                  {isInvalid && (
                    <p className="text-xs text-destructive mt-1">
                      {field.state.meta.errors
                        .map((e) => typeof e === "string" ? e : (e as { message?: string })?.message)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Message */}
          <form.Field name="message">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Why is this yours? *</FieldLabel>
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
                        .map((e) => typeof e === "string" ? e : (e as { message?: string })?.message)
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
