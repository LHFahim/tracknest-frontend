import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { itemService } from "@/services/item.service";
import { FoundItemStatus } from "@/types/item.interface";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<FoundItemStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [FoundItemStatus.REPORTED]: "default",
  [FoundItemStatus.IN_CUSTODY]: "secondary",
  [FoundItemStatus.READY_FOR_HANDOVER]: "outline",
  [FoundItemStatus.RETURNED]: "outline",
  [FoundItemStatus.UNCLAIMED]: "secondary",
  [FoundItemStatus.DISPOSED]: "destructive",
};

export default async function MyFoundItemsPage() {
  const { data, error } = await itemService.getAllFoundItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Found Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Items you have reported finding
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/report-found">+ Report Found Item</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">You haven&apos;t reported any found items yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/report-found">Report a Found Item</Link>
          </Button>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
            >
              {/* Edit button */}
              <Link
                href={`/dashboard/my-found-items/${item.id}/edit`}
                className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
                onClick={(e) => e.stopPropagation()}
              >
                <PencilIcon className="h-3 w-3" />
                Edit
              </Link>

              <Link href={`/items/${item.id}`} className="group block">
                <div className="flex items-start justify-between gap-2 pr-16">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <Badge variant={statusVariant[item.status]} className="shrink-0 text-xs">
                    {item.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Found:{" "}
                  {new Date(item.dateFound).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {item.locationFound && (
                  <p className="text-xs text-muted-foreground">{item.locationFound}</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
