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
  dateFound: z.string().min(1, "Date found is required"),
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
      const toastId = toast.loading("Submitting found item report...");

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

        toast.success("Found item report submitted successfully", {
          id: toastId,
        });

        router.push("/dashboard/my-found-items");
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
        <CardTitle className="text-xl">Found Item Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in the details as clearly as possible. Required fields are marked
          with an asterisk.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="report-found-form"
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
                      placeholder="e.g. Blue backpack found near the cafeteria"
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
                      placeholder="Describe the item, where it was found, and any visible features."
                      className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      Avoid sharing private details that should only be used for
                      ownership verification.
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

            {/* Date Found */}
            <form.Field name="dateFound">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date Found *</FieldLabel>
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

            {/* Custody Type */}
            <form.Field name="custodyType">
              {(field) => (
                <Field>
                  <FieldLabel>Currently With *</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as "USER" | "OFFICE")
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFICE">
                        Office / Lost &amp; Found desk
                      </SelectItem>
                      <SelectItem value="USER">
                        With me — I will hand it over
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select where the item is currently being kept.
                  </p>
                </Field>
              )}
            </form.Field>

            {/* Location Found */}
            <form.Field name="locationFound">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Location Found{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Cafeteria, Car Park A"
                    className="h-11 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add the place where you found the item if you remember it.
                  </p>
                </Field>
              )}
            </form.Field>

            {/* Brand and Colour */}
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
                      placeholder="e.g. Apple, Adidas"
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
                      placeholder="e.g. Red, Navy blue"
                      className="h-11 rounded-xl"
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
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    placeholder="Add details that only the real owner is likely to know."
                    className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">
                    These details can help staff verify ownership before the item
                    is returned.
                  </p>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button form="report-found-form" type="submit" className="flex-1">
            Submit Found Item Report
          </Button>

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}