"use client";

import { createCategory, updateCategory } from "@/actions/category.action";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/types/category.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  color: z
    .string()
    .refine((v) => v === "" || /^#[0-9A-Fa-f]{6}$/.test(v), {
      message: "Must be a valid hex colour (e.g. #2563EB)",
    }),
  icon: z.string(),
});

interface CategoryFormProps {
  /** When provided the form is in edit mode */
  category?: ICategory;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      color: category?.color ?? "",
      icon: category?.icon ?? "",
    },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        isEditing ? "Updating category…" : "Creating category…"
      );
      try {
        const payload = {
          name: value.name,
          description: value.description || undefined,
          color: value.color || undefined,
          icon: value.icon || undefined,
        };

        const res = isEditing
          ? await updateCategory(category!.id, payload)
          : await createCategory(payload);

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success(
          isEditing ? "Category updated" : "Category created",
          { id: toastId }
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/categories");
          router.refresh();
        }
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        {/* Name */}
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Electronics"
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Brief description of this category"
              />
            </Field>
          )}
        </form.Field>

        {/* Icon & Colour side-by-side */}
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="icon">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Icon{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. laptop, bag, key"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="color">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Colour{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="flex gap-2 items-center">
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="#2563EB"
                      className="flex-1"
                    />
                    {field.state.value &&
                      /^#[0-9A-Fa-f]{6}$/.test(field.state.value) && (
                        <div
                          className="h-9 w-9 rounded-lg border border-border shrink-0"
                          style={{ backgroundColor: field.state.value }}
                        />
                      )}
                  </div>
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          {isEditing ? "Save Changes" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) onSuccess();
            else router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
