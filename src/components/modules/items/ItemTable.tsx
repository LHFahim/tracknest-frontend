"use client";

import {
  deleteFoundItem,
  deleteLostItem,
  updateFoundItemStatus,
  updateLostItemStatus,
} from "@/actions/items.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import {
  FoundItemStatus,
  IFoundItem,
  ILostItem,
  LostItemStatus,
  isLostItem,
} from "@/types/item.interface";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ItemTable({
  lostItems,
  foundItems,
}: {
  lostItems: ILostItem[];
  foundItems: IFoundItem[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (item: ILostItem | IFoundItem) => {
    const toastId = toast.loading("Deleting item...");
    setLoadingId(item.id);

    try {
      const res = isLostItem(item)
        ? await deleteLostItem(item.id)
        : await deleteFoundItem(item.id);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Item deleted successfully", { id: toastId });
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const handleLostStatusChange = async (id: string, status: LostItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setLoadingId(id);

    try {
      const res = await updateLostItemStatus(id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Status updated", { id: toastId });
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const handleFoundStatusChange = async (id: string, status: FoundItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setLoadingId(id);

    try {
      const res = await updateFoundItemStatus(id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Status updated", { id: toastId });
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const allItems: (ILostItem | IFoundItem)[] = [...lostItems, ...foundItems];

  return (
    <div className="border rounded-md p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No items found
              </TableCell>
            </TableRow>
          ) : (
            allItems.map((item) => {
              const lost = isLostItem(item);
              // ISO date string from backend — e.g. "2024-01-15T00:00:00.000Z"
              const dateStr = lost ? item.dateLost : item.dateFound;
              const location = lost ? item.locationLost : item.locationFound;

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/items/${item.id}`}
                      className="hover:underline underline-offset-4"
                    >
                      {item.title}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Badge variant={lost ? "destructive" : "default"}>
                      {lost ? "LOST" : "FOUND"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>

                  <TableCell>{location ?? "—"}</TableCell>

                  <TableCell>
                    {dateStr ? formatDateTime(dateStr) : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={loadingId === item.id}
                        >
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/items/${item.id}`}>View details</Link>
                        </DropdownMenuItem>

                        {lost && item.status === LostItemStatus.OPEN && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleLostStatusChange(
                                item.id,
                                LostItemStatus.CLAIM_REQUESTED
                              )
                            }
                          >
                            Mark Claim Requested
                          </DropdownMenuItem>
                        )}
                        {lost && item.status === LostItemStatus.CLAIM_REQUESTED && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleLostStatusChange(
                                  item.id,
                                  LostItemStatus.CLAIM_APPROVED
                                )
                              }
                            >
                              Approve Claim
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleLostStatusChange(
                                  item.id,
                                  LostItemStatus.CLAIM_REJECTED
                                )
                              }
                            >
                              Reject Claim
                            </DropdownMenuItem>
                          </>
                        )}
                        {lost &&
                          item.status !== LostItemStatus.CLOSED && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleLostStatusChange(
                                  item.id,
                                  LostItemStatus.CLOSED
                                )
                              }
                            >
                              Close
                            </DropdownMenuItem>
                          )}

                        {!lost &&
                          item.status === FoundItemStatus.REPORTED && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleFoundStatusChange(
                                  item.id,
                                  FoundItemStatus.IN_CUSTODY
                                )
                              }
                            >
                              Mark In Custody
                            </DropdownMenuItem>
                          )}
                        {!lost &&
                          item.status === FoundItemStatus.IN_CUSTODY && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleFoundStatusChange(
                                  item.id,
                                  FoundItemStatus.RETURNED
                                )
                              }
                            >
                              Mark Returned
                            </DropdownMenuItem>
                          )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
