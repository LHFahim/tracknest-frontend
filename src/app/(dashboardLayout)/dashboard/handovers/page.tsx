import { RecordHandoverButton } from "@/components/modules/handovers/RecordHandoverButton";
import { handoverService } from "@/services/handover.service";
import { itemService } from "@/services/item.service";
import { claimService } from "@/services/claim.service";
import { userService } from "@/services/user.service";
import { ClaimStatus } from "@/types/claim.interface";

export const dynamic = "force-dynamic";

export default async function AdminHandoversPage() {
  const [{ data, error }, foundRes, claimsRes, usersRes] = await Promise.all([
    handoverService.adminGetAllHandovers(),
    itemService.getAllFoundItems({ pageSize: 100 }),
    claimService.adminGetAllClaims(),
    userService.getAllUsers(),
  ]);

  const foundItemsMap = Object.fromEntries(
    (foundRes.data?.items ?? []).map((i) => [i.id, i])
  );
  const usersMap = Object.fromEntries(
    (usersRes.data?.items ?? []).map((u) => [u.id, u])
  );

  const approvedClaims = (claimsRes.data?.items ?? []).filter(
    (c) => c.status === ClaimStatus.APPROVED
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Handovers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record handovers for approved claims
        </p>
      </div>

      {/* Approved claims awaiting handover */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Approved Claims — Ready for Handover
        </h2>

        {approvedClaims.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No approved claims awaiting handover.
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Found Item</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Claimant</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Claim Message</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedClaims.map((claim, i) => {
                  const foundItem = foundItemsMap[claim.foundItemId];
                  const claimant = usersMap[claim.claimedBy];
                  return (
                    <tr key={claim.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-4 py-3 font-medium">
                        {foundItem?.title ?? claim.foundItemId}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {claimant ? `${claimant.firstName} ${claimant.lastName}` : claim.claimedBy}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                        {claim.message}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RecordHandoverButton
                          foundItemId={claim.foundItemId}
                          receivedByUserId={claim.claimedBy}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Existing handovers */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Completed Handovers
        </h2>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No handovers recorded yet.
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Found Item</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Received By</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Handed Over By</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Note</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((h, i) => (
                  <tr key={h.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="px-4 py-3 font-medium">
                      {foundItemsMap[h.foundItem]?.title ?? h.foundItem}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {usersMap[h.receivedByUser]
                        ? `${usersMap[h.receivedByUser].firstName} ${usersMap[h.receivedByUser].lastName}`
                        : h.receivedByUser}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {usersMap[h.handedOverBy]
                        ? `${usersMap[h.handedOverBy].firstName} ${usersMap[h.handedOverBy].lastName}`
                        : h.handedOverBy}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{h.note ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(h.handedOverAt).toLocaleDateString("en-AU", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
