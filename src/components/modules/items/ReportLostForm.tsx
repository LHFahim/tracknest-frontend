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
  dateLost: z.string().min(1, "Date lost is required"),
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
      const toastId = toast.loading("Submitting lost item report...");

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

        toast.success("Lost item report submitted successfully", {
          id: toastId,
        });

        router.push("/dashboard/my-lost-items");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.", {
          id: toastId,
        });
      }
    },
  });

  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl">Lost Item Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in the details as accurately as possible. Required fields are
          marked with an asterisk.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="report-lost-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-5">
            {/* Title */}
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Item Title *</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Black leather wallet"
                      className="h-11 rounded-xl"
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
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Item Description *
                    </FieldLabel>
                    <textarea
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      placeholder="Describe the item, markings, contents, or any features that can help identify it."
                      className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      Add details that would make the item easier to recognise.
                    </p>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Category */}
            <form.Field name="category">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Category *</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v)}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select the item category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Date Lost */}
            <form.Field name="dateLost">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date Lost *</FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="h-11 rounded-xl"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Main Library, Building B"
                    className="h-11 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    If you remember the place, add it to help narrow down the
                    search.
                  </p>
                </Field>
              )}
            </form.Field>

            {/* Brand and Color */}
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="brand">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Brand{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Samsung, Nike"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="color">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Colour{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Black, Silver"
                      className="h-11 rounded-xl"
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
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="url"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://example.com/item-photo.jpg"
                    className="h-11 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add an image link if you have one.
                  </p>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button form="report-lost-form" type="submit" className="flex-1">
            Submit Lost Item Report
          </Button>

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}