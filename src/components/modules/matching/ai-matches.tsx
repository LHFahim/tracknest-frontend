import { IAIMatch } from "@/types/item.interface";
import { ArrowRight, PackageSearch, Sparkles } from "lucide-react";
import Link from "next/link";

function scoreBadgeClass(score: number) {
  if (score >= 92) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }
  if (score >= 88) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }
  return "bg-muted text-muted-foreground";
}

function scoreLabel(score: number) {
  if (score >= 92) return "Strong match";
  if (score >= 88) return "Likely match";
  return "Possible match";
}

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Not provided";
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AIMatches({ matches }: { matches: IAIMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <PackageSearch className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">No strong matches yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Our matching engine hasn&apos;t found a confident match for this report
          yet. New found items are checked automatically as they are reported, so
          check back soon.
        </p>
        <Link
          href="/items?type=found"
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Browse all found items
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => (
        <article
          key={match.foundItemId}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            {/* Thumbnail */}
            {match.images?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.images[0]}
                alt={match.title}
                className="h-24 w-24 shrink-0 rounded-xl border border-border object-cover"
              />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  {match.title}
                </h3>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${scoreBadgeClass(
                    match.score
                  )}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {match.score}% · {scoreLabel(match.score)}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {match.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                {match.brand && <span>Brand: {match.brand}</span>}
                {match.color && <span>Colour: {match.color}</span>}
                {match.locationFound && <span>Found at: {match.locationFound}</span>}
                <span>Date found: {formatDate(match.dateFound)}</span>
              </div>

              <Link
                href={`/items/${match.foundItemId}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                View &amp; claim
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
