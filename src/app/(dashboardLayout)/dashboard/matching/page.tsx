import MatchingAssistant from "@/components/modules/matching/matching-assistant";
import { generateMatches } from "@/lib/matching";
import { itemService } from "@/services/item.service";

export const dynamic = "force-dynamic";

export default async function MatchingPage() {
  const [lostItemsResult, foundItemsResult] = await Promise.all([
    itemService.getAllLostItems({ pageSize: 50 }),
    itemService.getAllFoundItems({ pageSize: 50 }),
  ]);

  const lostItems = lostItemsResult.data?.items ?? [];
  const foundItems = foundItemsResult.data?.items ?? [];

  const matches = generateMatches(lostItems, foundItems);

  return (
    <div className="space-y-6">
      {(lostItemsResult.error || foundItemsResult.error) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          Some item data could not be loaded. The assistant is showing results
          based on the available reports only.
        </div>
      )}

      <MatchingAssistant
        matches={matches}
        lostItems={lostItems}
        foundItems={foundItems}
      />
    </div>
  );
}
