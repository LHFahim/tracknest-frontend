"use client";

import { deleteItem, updateItemStatus } from "@/actions/items.action";
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
import { IItem, ItemStatus } from "@/types/item.interface";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
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

export function ItemTable({ items }: { items: IItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting item...");
    setLoadingId(id);

    try {
      const res = await deleteItem(id);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Item deleted successfully", { id: toastId });
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: ItemStatus) => {
    const toastId = toast.loading("Updating status...");
    setLoadingId(id);

    try {
      const res = await updateItemStatus(id, status);

      if (res.error) {
        toast.error(res.error.message, { id: toastId });
        return;
      }

      toast.success("Item status updated", { id: toastId });
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="border rounded-md p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Reported by</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
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
                  <Badge variant="outline">
                    {item.category.charAt(0) +
                      item.category.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[item.status]}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.reporterName ?? "N/A"}</TableCell>
                <TableCell>
                  {new Date(item.date).toISOString().split("T")[0]}
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
                      {item.status !== "CLAIMED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(item.id, "CLAIMED")
                          }
                        >
                          Mark as Claimed
                        </DropdownMenuItem>
                      )}
                      {item.status === "LOST" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(item.id, "FOUND")}
                        >
                          Mark as Found
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
