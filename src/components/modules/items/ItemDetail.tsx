"use client";

import {
  deleteFoundItem,
  deleteLostItem,
  updateFoundItemStatus,
  updateLostItemStatus,
} from "@/actions/items.action";
import { ClaimButton } from "@/components/modules/claims/ClaimButton";
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
import { formatDateTime } from "@/lib/utils";
import {
  FoundItemStatus,
  IFoundItem,
  ILostItem,
  LostItemStatus,
  isLostItem,
} from "@/types/item.interface";
import { CalendarIcon, MapPinIcon, PencilIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ItemDetail({
  item,
  role,
  userId,
}: {
  item: ILostItem | IFoundItem;
  role?: string;
  userId?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const lost = isLostItem(item);

  // Check if current user owns this item
  const ownerId = lost ? item.createdBy : item.foundBy;
  const isOwner = !!userId && userId === ownerId;
  const editHref = lost
    ? `/dashboard/my-lost-items/${item.id}/edit`
    : `/dashboard/my-found-items/${item.id}/edit`;

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting item...");
    setIsLoading(true);

    try {
      const res = lost
        ? await deleteLostItem(item.id)
        : await deleteFoundItem(item.id);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Item deleted", { id: toastId });
      router.push("/items");
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLostStatus = async (status: LostItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setIsLoading(true);

    try {
      const res = await updateLostItemStatus(item.id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Status updated", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoundStatus = async (status: FoundItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setIsLoading(true);

    try {
      const res = await updateFoundItemStatus(item.id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Status updated", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Derive display values — ISO date string from backend
  const dateLabel = lost ? "Date Lost" : "Date Found";
  const dateValue = lost ? item.dateLost : item.dateFound;
  const locationLabel = lost ? "Location Lost" : "Location Found";
  const locationValue = lost
    ? item.locationLost
    : item.locationFound;

  // Primary image(s)
  const primaryImage = lost
    ? item.imageURL
    : item.images?.[0];
  const extraImages = !lost && item.images?.length > 1
    ? item.images.slice(1)
    : [];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Primary image */}
      {primaryImage && (
        <div className="w-full h-64 rounded-lg border overflow-hidden bg-muted">
          <img
            src={primaryImage}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Extra images for found items */}
      {extraImages.length > 0 && (
        <div className="flex gap-3 overflow-x-auto">
          {extraImages.map((src, i) => (
            <div
              key={i}
              className="w-32 h-32 shrink-0 rounded-md border overflow-hidden bg-muted"
            >
              <img
                src={src}
                alt={`${item.title} ${i + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant={lost ? "destructive" : "default"}>
                {lost ? "LOST" : "FOUND"}
              </Badge>
              <Badge variant="outline">{item.status}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Date — ISO string formatted for display */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4 shrink-0" />
              <span>
                {dateLabel}:{" "}
                <span className="text-foreground font-medium">
                  {dateValue ? formatDateTime(dateValue) : "—"}
                </span>
              </span>
            </div>

            {/* Location */}
            {locationValue && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="size-4 shrink-0" />
                <span>
                  {locationLabel}:{" "}
                  <span className="text-foreground font-medium">
                    {locationValue}
                  </span>
                </span>
              </div>
            )}

            {/* Brand */}
            {item.brand && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0" />
                <span>
                  Brand:{" "}
                  <span className="text-foreground font-medium">
                    {item.brand}
                  </span>
                </span>
              </div>
            )}

            {/* Color */}
            {item.color && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0" />
                <span>
                  Color:{" "}
                  <span className="text-foreground font-medium">
                    {item.color}
                  </span>
                </span>
              </div>
            )}

            {/* Found-only: custody type */}
            {!lost && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0" />
                <span>
                  Custody:{" "}
                  <span className="text-foreground font-medium">
                    {item.custodyType}
                  </span>
                </span>
              </div>
            )}

            {/* Found-only: identifying details */}
            {!lost && item.identifyingDetails && (
              <div className="col-span-full flex items-start gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0 mt-0.5" />
                <span>
                  Identifying details:{" "}
                  <span className="text-foreground font-medium">
                    {item.identifyingDetails}
                  </span>
                </span>
              </div>
            )}
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">
            Submitted {item.createdAt ? formatDateTime(item.createdAt) : "—"}
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

        {/* Edit button — shown to owner */}
        {isOwner && (
          <Button asChild variant="outline" disabled={isLoading}>
            <Link href={editHref}>
              <PencilIcon className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
        )}

        {/* Lost item status transitions */}
        {lost && item.status === LostItemStatus.OPEN && (
          <Button
            onClick={() => handleLostStatus(LostItemStatus.CLAIM_REQUESTED)}
            disabled={isLoading}
          >
            Request Claim
          </Button>
        )}
        {lost && item.status === LostItemStatus.CLAIM_REQUESTED && (
          <>
            <Button
              onClick={() => handleLostStatus(LostItemStatus.CLAIM_APPROVED)}
              disabled={isLoading}
            >
              Approve Claim
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleLostStatus(LostItemStatus.CLAIM_REJECTED)}
              disabled={isLoading}
            >
              Reject Claim
            </Button>
          </>
        )}
        {lost && item.status !== LostItemStatus.CLOSED && (
          <Button
            variant="secondary"
            onClick={() => handleLostStatus(LostItemStatus.CLOSED)}
            disabled={isLoading}
          >
            Close
          </Button>
        )}

        {/* Found item — claim button for regular users */}
        {!lost && role === "NORMAL_USER" && item.status === FoundItemStatus.REPORTED && (
          <ClaimButton foundItemId={item.id} itemTitle={item.title} />
        )}

        {/* Found item status transitions for admin/staff */}
        {!lost && role !== "NORMAL_USER" && item.status === FoundItemStatus.REPORTED && (
          <Button
            onClick={() => handleFoundStatus(FoundItemStatus.IN_CUSTODY)}
            disabled={isLoading}
          >
            Mark In Custody
          </Button>
        )}
        {!lost && role !== "NORMAL_USER" && item.status === FoundItemStatus.IN_CUSTODY && (
          <Button
            onClick={() => handleFoundStatus(FoundItemStatus.READY_FOR_HANDOVER)}
            disabled={isLoading}
          >
            Ready for Handover
          </Button>
        )}
        {!lost && role !== "NORMAL_USER" && item.status === FoundItemStatus.READY_FOR_HANDOVER && (
          <Button
            onClick={() => handleFoundStatus(FoundItemStatus.RETURNED)}
            disabled={isLoading}
          >
            Mark Returned
          </Button>
        )}

        {role !== "NORMAL_USER" && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="ml-auto"
          >
            Delete Item
          </Button>
        )}
      </div>
    </div>
  );
}
