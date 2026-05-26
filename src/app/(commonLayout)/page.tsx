import HeroSection from "@/components/modules/home/hero-section";
import { claimService } from "@/services/claim.service";
import { itemService } from "@/services/item.service";
import { ClaimStatus } from "@/types/claim.interface";
import { FoundItemStatus } from "@/types/item.interface";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lostItemsResult, foundItemsResult, claimsResult] = await Promise.all([
    itemService.getAllLostItems({ pageSize: 5 }),
    itemService.getAllFoundItems({ pageSize: 5 }),
    claimService.getMyClaims(),
  ]);

  const lostItems = lostItemsResult.data?.items ?? [];
  const foundItems = foundItemsResult.data?.items ?? [];
  const claims = claimsResult.data?.items ?? [];

  const totalLostItems =
    lostItemsResult.data?.pagination?.total ?? lostItems.length;

  const totalFoundItems =
    foundItemsResult.data?.pagination?.total ?? foundItems.length;

  const totalClaims = claimsResult.data?.pagination?.total ?? claims.length;

  const approvedClaims = claims.filter(
    (claim) => claim.status === ClaimStatus.APPROVED
  ).length;

  const returnedItems = foundItems.filter(
    (item) => item.status === FoundItemStatus.RETURNED
  ).length;

  const matchedCases = approvedClaims + returnedItems;

  const recoveryRate =
    totalFoundItems > 0
      ? Math.round((matchedCases / totalFoundItems) * 100)
      : 0;

  const recentActivities = [
    ...lostItems.slice(0, 2).map((item) => ({
      title: item.title,
      subtitle: item.locationLost
        ? `Lost near ${item.locationLost}`
        : "Lost item report submitted",
      status: item.status,
      type: "lost" as const,
    })),
    ...foundItems.slice(0, 2).map((item) => ({
      title: item.title,
      subtitle: item.locationFound
        ? `Found near ${item.locationFound}`
        : "Found item report submitted",
      status: item.status,
      type: "found" as const,
    })),
  ].slice(0, 3);

  return (
    <main>
      <HeroSection
        totalLostItems={totalLostItems}
        totalFoundItems={totalFoundItems}
        matchedCases={matchedCases}
        recoveryRate={recoveryRate}
        recentActivities={recentActivities}
      />
    </main>
  );
}