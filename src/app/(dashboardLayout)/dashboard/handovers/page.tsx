import { ApprovedClaimsTable } from "@/components/modules/handovers/ApprovedClaimsTable";
import { claimService } from "@/services/claim.service";
import { handoverService } from "@/services/handover.service";
import { itemService } from "@/services/item.service";
import { userService } from "@/services/user.service";
import { ClaimStatus, IClaim } from "@/types/claim.interface";
import { FoundItemStatus, IFoundItem } from "@/types/item.interface";
import { IHandover } from "@/types/handover.interface";
import { IUser } from "@/types/user.interface";

export const dynamic = "force-dynamic";

export default async function AdminHandoversPage() {
  const [{ data, error }, foundRes, claimsRes, usersRes] = await Promise.all([
    handoverService.adminGetAllHandovers(),
    itemService.getAllFoundItems({ pageSize: 100 }),
    claimService.adminGetAllClaims(),
    userService.getAllUsers(),
  ]);

  const foundItems: IFoundItem[] = foundRes.data?.items ?? [];
  const users: IUser[] = usersRes.data?.items ?? [];
  const handovers: IHandover[] = data?.items ?? [];
  const claims: IClaim[] = claimsRes.data?.items ?? [];

  const foundItemsMap: Record<string, IFoundItem> = Object.fromEntries(
    foundItems.map((item: IFoundItem) => [item.id, item])
  );

  const usersMap: Record<string, IUser> = Object.fromEntries(
    users.map((user: IUser) => [user.id, user])
  );

  const seenFoundItems = new Set<string>();

  const uniqueHandovers = handovers.filter((handover: IHandover) => {
    if (seenFoundItems.has(handover.foundItem)) {
      return false;
    }

    seenFoundItems.add(handover.foundItem);
    return true;
  });

  const handoveredItemIds = seenFoundItems;

  const approvedClaims = claims.filter((claim: IClaim) => {
    const foundItem = foundItemsMap[claim.foundItemId];

    return (
      claim.status === ClaimStatus.APPROVED &&
      !!foundItem &&
      foundItem.status !== FoundItemStatus.RETURNED &&
      !handoveredItemIds.has(claim.foundItemId)
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Handovers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record handovers for approved claims
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Approved Claims — Ready for Handover
        </h2>

        <ApprovedClaimsTable
          claims={approvedClaims}
          foundItemsMap={foundItemsMap}
          usersMap={usersMap}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Completed Handovers
        </h2>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {uniqueHandovers.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No handovers recorded yet.
          </div>
        )}

        {uniqueHandovers.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Found Item
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Received By
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                    Handed Over By
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                    Note
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {uniqueHandovers.map((handover: IHandover, index: number) => {
                  const foundItem = foundItemsMap[handover.foundItem];
                  const receiver = usersMap[handover.receivedByUser];
                  const staff = usersMap[handover.handedOverBy];

                  return (
                    <tr
                      key={handover.id}
                      className={`border-b border-border last:border-0 ${
                        index % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {foundItem?.title ?? handover.foundItem}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {receiver
                          ? `${receiver.firstName} ${receiver.lastName}`
                          : handover.receivedByUser}
                      </td>

                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {staff
                          ? `${staff.firstName} ${staff.lastName}`
                          : handover.handedOverBy}
                      </td>

                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {handover.note ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(handover.handedOverAt).toLocaleDateString(
                          "en-AU",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}