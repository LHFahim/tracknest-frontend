"use client";

import { createFoundItem } from "@/actions/items.action";
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
import { CustodyType } from "@/types/item.interface";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  dateFound: z.string().min(1, "Date is required"),
  custodyType: z.enum(["USER", "OFFICE"]),
  locationFound: z.string(),
  brand: z.string(),
  color: z.string(),
  identifyingDetails: z.string(),
});

interface ReportFoundFormProps {
  categories: ICategory[];
}

export function ReportFoundForm({ categories }: ReportFoundFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      dateFound: "",
      custodyType: "OFFICE" as "USER" | "OFFICE",
      locationFound: "",
      brand: "",
      color: "",
      identifyingDetails: "",
    },
    validators: { onChange: formSchema, onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting report…");
      try {
        const res = await createFoundItem({
          title: value.title,
          description: value.description,
          category: value.category,
          dateFound: new Date(value.dateFound).toISOString(),
          custodyType: value.custodyType as CustodyType,
          locationFound: value.locationFound || undefined,
          brand: value.brand || undefined,
          color: value.color || undefined,
          identifyingDetails: value.identifyingDetails || undefined,
          images: [],
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Found item reported successfully", { id: toastId });
        router.push("/dashboard/my-found-items");
        router.refresh();
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a Found Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="report-found-form"
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
                      placeholder="e.g. Blue backpack found near canteen"
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
                      placeholder="Describe the item in detail to help the owner identify it…"
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

            {/* Date Found */}
            <form.Field name="dateFound">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date Found *</FieldLabel>
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

            {/* Custody Type */}
            <form.Field name="custodyType">
              {(field) => (
                <Field>
                  <FieldLabel>Currently with *</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as "USER" | "OFFICE")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFICE">Office / Lost & Found desk</SelectItem>
                      <SelectItem value="USER">With me (I'll hand it over)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            {/* Location Found */}
            <form.Field name="locationFound">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Location Found{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Cafeteria, Car Park A"
                  />
                </Field>
              )}
            </form.Field>

            {/* Brand & Color */}
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
                      placeholder="e.g. Apple, Adidas"
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
                      placeholder="e.g. Red, Navy blue"
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            {/* Identifying Details */}
            <form.Field name="identifyingDetails">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Identifying Details{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={2}
                    placeholder="Any details only the true owner would know…"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>

        <div className="mt-6 flex gap-3">
          <Button form="report-found-form" type="submit" className="flex-1">
            Submit Report
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
