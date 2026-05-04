"use client";

import { updateLostItem } from "@/actions/items.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category.interface";
import { ILostItem } from "@/types/item.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  dateLost: z.string().min(1, "Date is required"),
  locationLost: z.string(),
  brand: z.string(),
  color: z.string(),
  imageURL: z.string(),
});

export function EditLostItemForm({
  item,
  categories,
}: {
  item: ILostItem;
  categories: ICategory[];
}) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: item.title,
      description: item.description,
      category: typeof item.category === "string" ? item.category : "",
      dateLost: item.dateLost?.split("T")[0] ?? "",
      locationLost: item.locationLost ?? "",
      brand: item.brand ?? "",
      color: item.color ?? "",
      imageURL: item.imageURL ?? "",
    },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving changes…");
      try {
        const res = await updateLostItem(item.id, {
          title: value.title,
          description: value.description,
          category: value.category,
          dateLost: new Date(value.dateLost).toISOString(),
          locationLost: value.locationLost || undefined,
          brand: value.brand || undefined,
          color: value.color || undefined,
          imageURL: value.imageURL || undefined,
        });
        if (res.error) { toast.error(res.error.message, { id: toastId }); return; }
        toast.success("Lost item updated", { id: toastId });
        router.push("/dashboard/my-lost-items");
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
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
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

        <form.Field name="dateLost">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date Lost *</FieldLabel>
                <Input id={field.name} type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="locationLost">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Location Lost <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
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

        <form.Field name="imageURL">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Image URL <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
              <Input id={field.name} type="url" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="https://…" />
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
