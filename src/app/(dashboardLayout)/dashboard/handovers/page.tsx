import { ApprovedClaimsTable } from "@/components/modules/handovers/ApprovedClaimsTable";
import { handoverService } from "@/services/handover.service";
import { itemService } from "@/services/item.service";
import { claimService } from "@/services/claim.service";
import { userService } from "@/services/user.service";
import { ClaimStatus } from "@/types/claim.interface";
import { FoundItemStatus } from "@/types/item.interface";

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

  // Build a set of foundItem IDs that already have a recorded handover
  const handoveredItemIds = new Set((data?.items ?? []).map((h) => h.foundItem));

  const allApproved = (claimsRes.data?.items ?? []).filter(c => c.status === ClaimStatus.APPROVED);
  console.log('[handovers page] handoveredItemIds:', [...handoveredItemIds]);
  console.log('[handovers page] approved claims foundItemId values:', allApproved.map(c => ({ claimId: c.id, foundItemId: c.foundItemId, inMap: !!foundItemsMap[c.foundItemId], mapStatus: foundItemsMap[c.foundItemId]?.status, inHandoveredSet: handoveredItemIds.has(c.foundItemId) })));

  // Only show approved claims where:
  // 1. The found item exists and is not yet RETURNED
  // 2. No handover record already exists for this found item
  const approvedClaims = allApproved.filter(
    (c) =>
      !!foundItemsMap[c.foundItemId] &&
      foundItemsMap[c.foundItemId].status !== FoundItemStatus.RETURNED &&
      !handoveredItemIds.has(c.foundItemId)
  );
  console.log('[handovers page] final approvedClaims count:', approvedClaims.length);

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

        <ApprovedClaimsTable
          claims={approvedClaims}
          foundItemsMap={foundItemsMap}
          usersMap={usersMap}
        />
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
