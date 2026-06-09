import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  HandHeart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

type RecentActivity = {
  title: string;
  subtitle: string;
  status: string;
  type: "lost" | "found";
};

interface HeroSectionProps {
  isLoggedIn: boolean;
  totalLostItems: number;
  totalFoundItems: number;
  matchedCases: number;
  recoveryRate: number;
  recentActivities: RecentActivity[];
}

function getStatusStyle(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus.includes("APPROVED") ||
    normalizedStatus.includes("RETURNED") ||
    normalizedStatus.includes("MATCHED")
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    normalizedStatus.includes("PENDING") ||
    normalizedStatus.includes("CLAIM") ||
    normalizedStatus.includes("REVIEW")
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    normalizedStatus.includes("OPEN") ||
    normalizedStatus.includes("REPORTED") ||
    normalizedStatus.includes("NEW")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-muted text-muted-foreground";
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const howItWorks = [
  {
    icon: FileText,
    title: "Report it",
    text: "Tell us what you lost or found, with a few details and an optional photo.",
  },
  {
    icon: Target,
    title: "AI matching",
    text: "Our engine compares your report against found items and surfaces the closest matches.",
  },
  {
    icon: HandHeart,
    title: "Recover it",
    text: "Claim your item and arrange a verified handover with staff.",
  },
];

export default function HeroSection({
  isLoggedIn,
  totalLostItems,
  totalFoundItems,
  matchedCases,
  recoveryRate,
  recentActivities,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[280px] w-[280px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Smart Lost &amp; Found for universities, offices, and institutions
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reconnect people with their
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                lost belongings
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              TrackNest helps you report lost and found items, search listings,
              and recover belongings faster with a clean workflow, secure
              claims, and AI-powered matching.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/items"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Browse Items
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Secure claims
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  AI matching
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Easy reporting
                </span>
              </div>
            </div>
          </div>

          {/* Right panel - live overview when logged in, "how it works" when not */}
          {isLoggedIn ? (
            <div className="relative">
              <div className="relative rounded-3xl border border-border bg-background/90 p-6 shadow-2xl backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      TrackNest Dashboard
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">
                      Lost &amp; Found Overview
                    </h3>
                  </div>

                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Live System
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">
                      Reported Lost Items
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-foreground">
                      {totalLostItems}
                    </h4>
                    <p className="mt-1 text-xs text-emerald-600">
                      Real reports from system
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">
                      Found Item Reports
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-foreground">
                      {totalFoundItems}
                    </h4>
                    <p className="mt-1 text-xs text-emerald-600">
                      Items reported as found
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Recent Activity
                    </p>

                    <div className="mt-4 space-y-3">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity, index) => (
                          <div
                            key={`${activity.type}-${activity.title}-${index}`}
                            className="flex items-center justify-between gap-4 rounded-xl bg-background px-4 py-3 shadow-sm"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {activity.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.subtitle}
                              </p>
                            </div>

                            <span
                              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                activity.status
                              )}`}
                            >
                              {formatStatus(activity.status)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-border bg-background px-4 py-5 text-center">
                          <p className="text-sm font-medium text-foreground">
                            No activity yet
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Lost and found reports will appear here after users
                            submit them.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
                <p className="text-xs text-muted-foreground">Recovery rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {recoveryRate}%
                </p>
              </div>

              <div className="absolute -right-4 -top-6 hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
                <p className="text-xs text-muted-foreground">
                  Matched / returned cases
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {matchedCases} successful recoveries
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="relative rounded-3xl border border-border bg-background/90 p-6 shadow-2xl backdrop-blur sm:p-8">
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    How TrackNest works
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">
                    From lost to recovered, in three steps
                  </h3>
                </div>

                <div className="space-y-4">
                  {howItWorks.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Step {index + 1}
                          </span>
                          <p className="text-sm font-semibold text-foreground">
                            {step.title}
                          </p>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Create your free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
                <p className="text-xs text-muted-foreground">Built for</p>
                <p className="text-sm font-semibold text-foreground">
                  Campuses &amp; offices
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
