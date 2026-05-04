import { WithdrawClaimButton } from "@/components/modules/claims/WithdrawClaimButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { claimService } from "@/services/claim.service";
import { ClaimStatus } from "@/types/claim.interface";
import Link from "next/link";

const statusVariant: Record<ClaimStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [ClaimStatus.PENDING]: "secondary",
  [ClaimStatus.UNDER_REVIEW]: "default",
  [ClaimStatus.APPROVED]: "outline",
  [ClaimStatus.REJECTED]: "destructive",
  [ClaimStatus.CANCELED]: "outline",
};

export default async function MyClaimsPage() {
  const { data, error } = await claimService.getMyClaims();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track the status of your item claims
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/items">Browse Items</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">You haven&apos;t submitted any claims yet.</p>
          <Button asChild className="mt-4">
            <Link href="/items">Browse Found Items</Link>
          </Button>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.items.map((claim) => (
            <div
              key={claim.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
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

                  <p className="mt-3 text-sm text-foreground line-clamp-2">{claim.message}</p>

                  {claim.reviewComment && (
                    <div className="mt-3 rounded-xl bg-muted/50 px-4 py-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Staff response
                      </p>
                      <p className="text-sm text-foreground line-clamp-2">{claim.reviewComment}</p>
                    </div>
                  )}

                  <Link
                    href={`/dashboard/my-claims/${claim.id}`}
                    className="mt-3 inline-block text-xs text-primary hover:underline"
                  >
                    View details →
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
