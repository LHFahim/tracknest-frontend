import { handoverService } from "@/services/handover.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyHandoversPage() {
  const { data, error } = await handoverService.getMyHandovers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Handovers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Items that have been handed over to you
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No items have been handed over to you yet.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.items.map((handover) => (
            <div
              key={handover.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    Handover Record
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(handover.handedOverAt).toLocaleDateString(
                      "en-AU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="grid gap-1 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">
                      Item ID
                    </span>
                    <span className="font-mono text-xs text-foreground break-all">
                      {handover.foundItem}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-24 shrink-0">
                      Handed by
                    </span>
                    <span className="font-mono text-xs text-foreground break-all">
                      {handover.handedOverBy}
                    </span>
                  </div>
                  {handover.note && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-24 shrink-0">
                        Note
                      </span>
                      <span className="text-foreground line-clamp-1">{handover.note}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/dashboard/my-handovers/${handover.id}`}
                  className="mt-3 inline-block text-xs text-primary hover:underline"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
