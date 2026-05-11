import { WithdrawClaimButton } from "@/components/modules/claims/WithdrawClaimButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { claimService } from "@/services/claim.service";
import { ClaimStatus } from "@/types/claim.interface";
import Link from "next/link";

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

function formatStatus(status: ClaimStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function MyClaimsPage() {
  const { data, error } = await claimService.getMyClaims();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Claims
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track the items you have claimed and check their review status.
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/items">Browse Items</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 shadow-sm">
          <p className="text-sm font-medium text-destructive">
            Unable to load claims
          </p>
          <p className="mt-1 text-sm text-destructive/90">{error.message}</p>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto max-w-md space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              No claims submitted yet
            </h2>
            <p className="text-sm text-muted-foreground">
              If you find an item that belongs to you, open the item details and
              submit a claim for review.
            </p>

            <Button asChild className="mt-2 rounded-xl">
              <Link href="/items">Browse Found Items</Link>
            </Button>
          </div>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.items.map((claim) => (
            <div
              key={claim.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[claim.status]}>
                      {formatStatus(claim.status)}
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

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground">
                    {claim.message}
                  </p>

                  {claim.reviewComment && (
                    <div className="mt-3 rounded-xl bg-muted/50 px-4 py-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Staff response
                      </p>
                      <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
                        {claim.reviewComment}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/dashboard/my-claims/${claim.id}`}
                    className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    View claim details →
                  </Link>
                </div>

                {(claim.status === ClaimStatus.PENDING ||
                  claim.status === ClaimStatus.UNDER_REVIEW) && (
                  <WithdrawClaimButton claimId={claim.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}