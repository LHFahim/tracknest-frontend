"use client";

import { updateFoundItem } from "@/actions/items.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category.interface";
import { CustodyType, IFoundItem } from "@/types/item.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  dateFound: z.string().min(1, "Date is required"),
  custodyType: z.nativeEnum(CustodyType),
  locationFound: z.string(),
  brand: z.string(),
  color: z.string(),
  identifyingDetails: z.string(),
});

export function EditFoundItemForm({
  item,
  categories,
}: {
  item: IFoundItem;
  categories: ICategory[];
}) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: item.title,
      description: item.description,
      category: typeof item.category === "string" ? item.category : "",
      dateFound: item.dateFound?.split("T")[0] ?? "",
      custodyType: item.custodyType ?? CustodyType.OFFICE,
      locationFound: item.locationFound ?? "",
      brand: item.brand ?? "",
      color: item.color ?? "",
      identifyingDetails: item.identifyingDetails ?? "",
    },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving changes…");
      try {
        const res = await updateFoundItem(item.id, {
          title: value.title,
          description: value.description,
          category: value.category,
          dateFound: new Date(value.dateFound).toISOString(),
          custodyType: value.custodyType,
          locationFound: value.locationFound || undefined,
          brand: value.brand || undefined,
          color: value.color || undefined,
          identifyingDetails: value.identifyingDetails || undefined,
        });
        if (res.error) { toast.error(res.error.message, { id: toastId }); return; }
        toast.success("Found item updated", { id: toastId });
        router.push("/dashboard/my-found-items");
        router.refresh();
      } catch {
        toast.error("Something went wrong.", { id: toastId });
      }
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description *</FieldLabel>
                <textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="category">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Category *</FieldLabel>
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="dateFound">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Date Found *</FieldLabel>
                  <Input id={field.name} type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="custodyType">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Custody Type *</FieldLabel>
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v as CustodyType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CustodyType.OFFICE}>Office</SelectItem>
                      <SelectItem value={CustodyType.USER}>With Me</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="locationFound">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Location Found <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
              <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            </Field>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="brand">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Brand <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
                <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="color">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Color <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
                <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="identifyingDetails">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Identifying Details <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
              <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Any unique marks, serial numbers, etc." />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">Save Changes</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
