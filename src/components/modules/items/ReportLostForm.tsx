"use client";

import { createLostItem } from "@/actions/items.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category.interface";
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

interface ReportLostFormProps {
  categories: ICategory[];
}

export function ReportLostForm({ categories }: ReportLostFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      dateLost: "",
      locationLost: "",
      brand: "",
      color: "",
      imageURL: "",
    },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting report…");
      try {
        const res = await createLostItem({
          title: value.title,
          description: value.description,
          category: value.category,
          dateLost: new Date(value.dateLost).toISOString(),
          locationLost: value.locationLost || undefined,
          brand: value.brand || undefined,
          color: value.color || undefined,
          imageURL: value.imageURL || undefined,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Lost item reported successfully", { id: toastId });
        router.push("/dashboard/my-lost-items");
        router.refresh();
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Lost Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="report-lost-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Title */}
            <form.Field name="title">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Black leather wallet"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Description */}
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
                      placeholder="Describe the item — markings, contents, distinguishing features…"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Category */}
            <form.Field name="category">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Category *</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Date Lost */}
            <form.Field name="dateLost">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date Lost *</FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Location Lost */}
            <form.Field name="locationLost">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Location Lost{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Main Library, Building B"
                  />
                </Field>
              )}
            </form.Field>

            {/* Brand & Color side-by-side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="brand">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Brand{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Samsung, Nike"
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="color">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Color{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Black, Silver"
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            {/* Image URL */}
            <form.Field name="imageURL">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Image URL{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://…"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>

        <div className="mt-6 flex gap-3">
          <Button
            form="report-lost-form"
            type="submit"
            className="flex-1"
          >
            Submit Report
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
