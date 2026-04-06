"use client";

import { deleteItem, updateItemStatus } from "@/actions/items.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IItem, ItemStatus } from "@/types/item.interface";
import { formatDateTime } from "@/lib/utils";
import {
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const statusVariant: Record<
  ItemStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  FOUND: "default",
  LOST: "destructive",
  CLAIMED: "secondary",
};

export function ItemDetail({ item }: { item: IItem }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting item...");
    setIsLoading(true);

    try {
      const res = await deleteItem(item.id);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Item deleted", { id: toastId });
      router.push("/items");
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: ItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setIsLoading(true);

    try {
      const res = await updateItemStatus(item.id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Status updated", { id: toastId });
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Image */}
      {item.image && (
        <div className="w-full h-64 rounded-lg border overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main detail card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
            <Badge variant={statusVariant[item.status]} className="shrink-0">
              {item.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TagIcon className="size-4 shrink-0" />
              <span>
                Category:{" "}
                <span className="text-foreground font-medium">
                  {item.category.charAt(0) +
                    item.category.slice(1).toLowerCase()}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" />
              <span>
                Location:{" "}
                <span className="text-foreground font-medium">
                  {item.location}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4 shrink-0" />
              <span>
                Date:{" "}
                <span className="text-foreground font-medium">
                  {formatDateTime(item.date)}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="size-4 shrink-0" />
              <span>
                Reported by:{" "}
                <span className="text-foreground font-medium">
                  {item.reporterName ?? "Unknown"}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">
            Submitted {formatDateTime(item.createdAt)}
          </p>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/items")}
          disabled={isLoading}
        >
          Back to Items
        </Button>

        {item.status === "LOST" && (
          <Button
            onClick={() => handleStatusChange("FOUND")}
            disabled={isLoading}
          >
            Mark as Found
          </Button>
        )}

        {item.status !== "CLAIMED" && (
          <Button
            variant="secondary"
            onClick={() => handleStatusChange("CLAIMED")}
            disabled={isLoading}
          >
            Mark as Claimed
          </Button>
        )}

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
          className="ml-auto"
        >
          Delete Item
        </Button>
      </div>
    </div>
  );
}
