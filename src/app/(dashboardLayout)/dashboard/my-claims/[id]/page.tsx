import { WithdrawClaimButton } from "@/components/modules/claims/WithdrawClaimButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { claimService } from "@/services/claim.service";
import { ClaimStatus } from "@/types/claim.interface";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: claim, error } = await claimService.getMyClaimById(id);

  if (!claim) {
    if (error?.message === "Claim not found.") notFound();
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error?.message ?? "Could not load claim."}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Claim Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View the details of your claim
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/my-claims">← Back to Claims</Link>
        </Button>
      </div>

      {/* Status card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Claim Status</CardTitle>
            <Badge variant={statusVariant[claim.status]}>
              {claim.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* Message */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Your message
            </p>
            <p className="text-foreground">{claim.message}</p>
          </div>

          {/* Review comment */}
          {claim.reviewComment && (
            <div className="rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Staff response
              </p>
              <p className="text-foreground">{claim.reviewComment}</p>
            </div>
          )}

          {/* Images */}
          {claim.images && claim.images.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Attached images
              </p>
              <div className="flex flex-wrap gap-3">
                {claim.images.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted hover:opacity-80 transition"
                  >
                    <img
                      src={src}
                      alt={`Evidence ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="grid gap-2 pt-2 border-t border-border">
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-28 shrink-0">Claim ID</span>
              <span className="font-mono text-foreground break-all">{claim.id}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-28 shrink-0">Found Item</span>
              <Link
                href={`/items/${claim.foundItemId}`}
                className="font-mono text-primary hover:underline break-all"
              >
                {claim.foundItemId}
              </Link>
            </div>
            {claim.lostItemId && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground w-28 shrink-0">Lost Item</span>
                <Link
                  href={`/items/${claim.lostItemId}`}
                  className="font-mono text-primary hover:underline break-all"
                >
                  {claim.lostItemId}
                </Link>
              </div>
            )}
            {claim.reviewDate && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground w-28 shrink-0">Reviewed</span>
                <span className="text-foreground">
                  {new Date(claim.reviewDate).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {claim.createdAt && (
              <div className="flex gap-2 text-xs">
                <span className="text-muted-foreground w-28 shrink-0">Submitted</span>
                <span className="text-foreground">
                  {new Date(claim.createdAt).toLocaleDateString("en-AU", {
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

      {/* Actions */}
      {(claim.status === ClaimStatus.PENDING ||
        claim.status === ClaimStatus.UNDER_REVIEW) && (
        <div className="flex gap-3">
          <WithdrawClaimButton claimId={claim.id} />
        </div>
      )}
    </div>
  );
}
