import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handoverService } from "@/services/handover.service";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HandoverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: handover, error } = await handoverService.getHandoverById(id);

  if (!handover) {
    if (error?.message === "Handover not found.") notFound();
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error?.message ?? "Could not load handover."}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Handover Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record of item handover
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/my-handovers">← Back to Handovers</Link>
        </Button>
      </div>

      {/* Detail card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Handover Record</CardTitle>
            <Badge variant="outline">
              {new Date(handover.handedOverAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* Note */}
          {handover.note && (
            <div className="rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Note</p>
              <p className="text-foreground">{handover.note}</p>
            </div>
          )}

          {/* Verification method */}
          {handover.verificationMethod && (
            <div className="rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Verification Method
              </p>
              <p className="text-foreground">{handover.verificationMethod}</p>
            </div>
          )}

          {/* Meta */}
          <div className="grid gap-2 pt-2 border-t border-border">
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-32 shrink-0">Handover ID</span>
              <span className="font-mono text-foreground break-all">{handover.id}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-32 shrink-0">Found Item</span>
              <Link
                href={`/items/${handover.foundItem}`}
                className="font-mono text-primary hover:underline break-all"
              >
                {handover.foundItem}
              </Link>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-32 shrink-0">Received By</span>
              <span className="font-mono text-foreground break-all">
                {handover.receivedByUser}
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-32 shrink-0">Handed Over By</span>
              <span className="font-mono text-foreground break-all">
                {handover.handedOverBy}
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-32 shrink-0">Date &amp; Time</span>
              <span className="text-foreground">
                {new Date(handover.handedOverAt).toLocaleString("en-AU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {handover.createdAt && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground w-32 shrink-0">Created</span>
                <span className="text-foreground">
                  {new Date(handover.createdAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
