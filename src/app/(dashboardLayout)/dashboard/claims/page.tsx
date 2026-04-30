import { ReviewClaimButton } from "@/components/modules/claims/ReviewClaimButton";
import { Badge } from "@/components/ui/badge";
import { claimService } from "@/services/claim.service";
import { ClaimStatus } from "@/types/claim.interface";

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

export default async function AdminClaimsPage() {
  const { data, error } = await claimService.adminGetAllClaims();

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
        <div className="flex flex-col gap-4">
          {data.items.map((claim) => (
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

                  {/* IDs for admin reference */}
                  <div className="text-xs text-muted-foreground font-mono space-y-0.5 text-right">
                    <div>
                      Claim:{" "}
                      <span className="text-foreground">{claim.id}</span>
                    </div>
                    <div>
                      Found item:{" "}
                      <span className="text-foreground">{claim.foundItemId}</span>
                    </div>
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
      )}
    </div>
  );
}
