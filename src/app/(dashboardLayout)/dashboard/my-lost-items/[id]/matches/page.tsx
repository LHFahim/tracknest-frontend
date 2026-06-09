import { AIMatches } from "@/components/modules/matching/ai-matches";
import { Button } from "@/components/ui/button";
import { itemService } from "@/services/item.service";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// only show matches above this score
const MIN_SCORE = 85;

export default async function LostItemMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lostRes, matchesRes] = await Promise.all([
    itemService.getLostItemById(id),
    itemService.getLostItemAIMatches(id),
  ]);

  const lostItem = lostRes.data;
  const matches = (matchesRes.data ?? []).filter((m) => m.score >= MIN_SCORE);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Suggested Matches
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Matches for {lostItem?.title ?? "your lost report"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Found items our AI matching engine thinks could be yours, ranked by
            similarity. Review one and start a claim if it&apos;s your item.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/my-lost-items">← Back</Link>
        </Button>
      </div>

      {matchesRes.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {matchesRes.error.message}
        </div>
      )}

      {!matchesRes.error && <AIMatches matches={matches} />}
    </div>
  );
}
