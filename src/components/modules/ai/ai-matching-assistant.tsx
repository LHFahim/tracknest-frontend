import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  Info,
  MapPin,
  PackageSearch,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { AIMatchResult } from "@/lib/ai-matching";
import { IFoundItem, ILostItem } from "@/types/item.interface";

interface AIMatchingAssistantProps {
  matches: AIMatchResult[];
  lostItems: ILostItem[];
  foundItems: IFoundItem[];
}

const scoreRules = [
  { label: "Category", value: "25 pts" },
  { label: "Color", value: "20 pts" },
  { label: "Brand", value: "15 pts" },
  { label: "Title & Description", value: "20 pts" },
  { label: "Location", value: "10 pts" },
  { label: "Date", value: "10 pts" },
];

function getScoreBadgeClass(score: number) {
  if (score >= 70) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }

  if (score >= 40) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }

  return "bg-muted text-muted-foreground";
}

function getSignalClass(status: string) {
  if (status === "strong") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300";
  }

  if (status === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300";
  }

  if (status === "weak") {
    return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300";
  }

  return "border-border bg-muted/50 text-muted-foreground";
}

function formatDate(value?: string) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AIMatchingAssistant({
  matches,
  lostItems,
  foundItems,
}: AIMatchingAssistantProps) {
  const topMatch = matches[0];
  const highMatches = matches.filter((match) => match.matchScore >= 70).length;
  const mediumMatches = matches.filter(
    (match) => match.matchScore >= 40 && match.matchScore < 70
  ).length;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Assisted Support
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Matching Assistant
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              This assistant compares lost item reports with found item reports
              and calculates a possible match score using category, color,
              brand, title, description, location, and date similarity.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  AI support is used as a recommendation helper only. Final
                  claim approval and item handover decisions should always be
                  made by authorised staff or administrators.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Lost Reports</p>
                <FileSearch className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-3xl font-bold">{lostItems.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Reports available for comparison
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Found Reports</p>
                <PackageSearch className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-3xl font-bold">{foundItems.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Found item records checked by assistant
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Possible Matches
                </p>
                <SearchCheck className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-3xl font-bold">{matches.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {highMatches} high match, {mediumMatches} medium match
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-muted/20 p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">How the score works</h2>
              </div>

              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The assistant uses an explainable scoring approach. Each field
                contributes points to the final match score, so staff can clearly
                understand why a match was suggested.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {scoreRules.map((rule) => (
                <div
                  key={rule.label}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="text-xs text-muted-foreground">{rule.label}</p>
                  <p className="mt-1 text-lg font-bold">{rule.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {topMatch && (
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <BrainCircuit className="h-4 w-4" />
                Top AI Recommendation
              </div>

              <h2 className="text-2xl font-bold">
                {topMatch.lostItem.title} ↔ {topMatch.foundItem.title}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                {topMatch.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 text-center shadow-sm">
              <p className="text-xs text-muted-foreground">Highest Score</p>
              <p className="mt-1 text-4xl font-bold">{topMatch.matchScore}%</p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreBadgeClass(
                  topMatch.matchScore
                )}`}
              >
                {topMatch.matchLevel} Match
              </span>
            </div>
          </div>
        </section>
      )}

      {matches.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <PackageSearch className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            No possible matches found yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            The assistant needs at least one lost item report and one found item
            report with comparable information. Try adding item details such as
            category, color, brand, location, and description.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/report-lost"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Report Lost Item
            </Link>

            <Link
              href="/dashboard/report-found"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Report Found Item
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-6">
          {matches.map((match) => (
            <article
              key={match.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-col gap-5 border-b border-border bg-muted/30 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    AI Match Suggestion
                  </div>

                  <h2 className="mt-2 text-2xl font-bold">
                    {match.lostItem.title} ↔ {match.foundItem.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {match.summary}
                  </p>
                </div>

                <div className="min-w-40 rounded-2xl border border-border bg-background p-4 text-center shadow-sm">
                  <p className="text-xs text-muted-foreground">Match Score</p>
                  <p className="mt-1 text-4xl font-bold">
                    {match.matchScore}%
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreBadgeClass(
                      match.matchScore
                    )}`}
                  >
                    {match.matchLevel} Match
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FileSearch className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Lost Report</h3>
                  </div>

                  <p className="text-lg font-semibold">
                    {match.lostItem.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {match.lostItem.description}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Brand</p>
                      <p className="font-medium">
                        {match.lostItem.brand || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium">
                        {match.lostItem.color || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {match.lostItem.locationLost || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Date Lost</p>
                      <p className="font-medium">
                        {formatDate(match.lostItem.dateLost)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold">Found Report</h3>
                  </div>

                  <p className="text-lg font-semibold">
                    {match.foundItem.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {match.foundItem.description}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Brand</p>
                      <p className="font-medium">
                        {match.foundItem.brand || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium">
                        {match.foundItem.color || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {match.foundItem.locationFound || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Date Found
                      </p>
                      <p className="font-medium">
                        {formatDate(match.foundItem.dateFound)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">
                    Why this match was suggested
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {match.signals.map((signal) => (
                    <div
                      key={signal.label}
                      className={`rounded-2xl border p-4 ${getSignalClass(
                        signal.status
                      )}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{signal.label}</p>
                        <p className="text-sm font-bold">
                          {signal.score}/{signal.maxScore}
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6">
                        {signal.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-border bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location, color, and description are checked
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Date closeness is considered
                  </span>
                </div>

                <Link
                  href={`/items/${match.foundItem.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  View Found Item
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}