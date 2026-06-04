import { ReviewClaimButton } from "@/components/modules/claims/ReviewClaimButton";
import { Badge } from "@/components/ui/badge";
import { claimService } from "@/services/claim.service";
import { ClaimStatus, IClaim } from "@/types/claim.interface";
import Link from "next/link";
import { Target } from "lucide-react";

export const dynamic = "force-dynamic";

const statusVariant: Record<
  ClaimStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [ClaimStatus.PENDING]: "secondary",
  [ClaimStatus.UNDER_REVIEW]: "default",
  [ClaimStatus.APPROVED]: "outline",
  [ClaimStatus.REJECTED]: "destructive",
  [ClaimStatus.CANCELED]: "outline",
};

const ACTIVE_STATUSES = new Set([ClaimStatus.PENDING, ClaimStatus.UNDER_REVIEW]);

export default async function AdminClaimsPage() {
  const { data, error } = await claimService.adminGetAllClaims();

  // Group claims by foundItemId
  const grouped = new Map<string, IClaim[]>();
  for (const claim of data?.items ?? []) {
    const group = grouped.get(claim.foundItemId) ?? [];
    group.push(claim);
    grouped.set(claim.foundItemId, group);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Claims Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and action all item claims submitted by users
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No claims have been submitted yet.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-8">
          {[...grouped.entries()].map(([foundItemId, claims]) => {
            const activeCount = claims.filter((c) => ACTIVE_STATUSES.has(c.status)).length;
            const hasMultipleActive = activeCount > 1;

            return (
              <div key={foundItemId} className="flex flex-col gap-3">
                {/* Group header */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      Found item: <span className="text-foreground">{foundItemId}</span>
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {claims.length} claim{claims.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Smart matching banner when multiple active claims compete */}
                  {hasMultipleActive && (
                    <Link
                      href="/dashboard/matching"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/60"
                    >
                      <Target className="h-3.5 w-3.5" />
                      {activeCount} competing claims — use Smart Matching
                    </Link>
                  )}
                </div>

                {/* Claims in this group */}
                <div className="flex flex-col gap-3 pl-3 border-l-2 border-border">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={statusVariant[claim.status]}>
                              {claim.status.replace(/_/g, " ")}
                            </Badge>
                            {claim.lostItemId && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <span className="text-muted-foreground">Lost report linked</span>
                              </Badge>
                            )}
                            {claim.createdAt && (
                              <span className="text-xs text-muted-foreground">
                                Submitted{" "}
                                {new Date(claim.createdAt).toLocaleDateString("en-AU", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground font-mono space-y-0.5 text-right">
                            <div>
                              Claim: <span className="text-foreground">{claim.id}</span>
                            </div>
                            {claim.lostItemId && (
                              <div>
                                Lost report: <span className="text-foreground">{claim.lostItemId}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-foreground">{claim.message}</p>

                        {/* Existing review comment */}
                        {claim.reviewComment && (
                          <div className="rounded-xl bg-muted/50 px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Staff response
                            </p>
                            <p className="text-sm">{claim.reviewComment}</p>
                          </div>
                        )}

                        {/* Review action */}
                        <ReviewClaimButton
                          claimId={claim.id}
                          currentStatus={claim.status}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
