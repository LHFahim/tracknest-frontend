import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Target,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileSearch,
  Handshake,
  LayoutDashboard,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Lost Item Reporting",
    description:
      "Users can submit lost item reports with details such as title, category, brand, color, description, date, and location.",
    icon: FileSearch,
  },
  {
    title: "Found Item Reporting",
    description:
      "Found items can be recorded with custody details so staff and users can track where the item is held.",
    icon: ClipboardCheck,
  },
  {
    title: "Smart Matching",
    description:
      "The system supports matching by comparing item category, color, brand, location, date, and description similarity using a weighted scoring engine.",
    icon: Target,
  },
  {
    title: "Secure Claim Review",
    description:
      "Claim requests are reviewed before handover, helping reduce incorrect item returns and improving trust.",
    icon: ShieldCheck,
  },
  {
    title: "Role-Based Dashboard",
    description:
      "Different dashboard menus are provided for normal users, staff, and administrators based on their responsibilities.",
    icon: LayoutDashboard,
  },
  {
    title: "Verified Handover",
    description:
      "Approved claims can be completed through a handover workflow that records who received the item and when.",
    icon: Handshake,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Report",
    description:
      "A user reports a lost item or submits a found item with structured information.",
  },
  {
    step: "02",
    title: "Search & Match",
    description:
      "Users and staff can browse listings, search item records, and review possible matches.",
  },
  {
    step: "03",
    title: "Claim",
    description:
      "The owner submits a claim with supporting information or evidence.",
  },
  {
    step: "04",
    title: "Review",
    description:
      "Staff or admin checks the claim details and decides whether the item can be released.",
  },
  {
    step: "05",
    title: "Handover",
    description:
      "The item is returned through a verified handover process with proper tracking.",
  },
];

const userRoles = [
  {
    role: "Normal User",
    description:
      "Can report lost items, report found items, browse listings, submit claims, and track personal activity.",
  },
  {
    role: "Staff",
    description:
      "Can support item review, claim checking, and operational lost-and-found handling.",
  },
  {
    role: "Admin",
    description:
      "Can manage users, categories, claims, reports, and the overall lost-and-found workflow.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              About TrackNest
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              A smarter lost and found system for modern institutions
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              TrackNest is a Lost and Found Management System designed for
              universities, offices, and institutional environments. It helps
              users report lost and found items, submit claims, verify ownership,
              and complete safer handovers through a clear digital workflow.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/items"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Browse Items
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Project Overview
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                From manual tracking to digital recovery
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Many lost-and-found processes depend on paper records, verbal
                communication, or scattered spreadsheets. TrackNest centralises
                item reports, claim handling, admin review, and handover records
                in one web application.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">Target Users</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Students, staff, administrators, reception teams, and campus
                  security.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">Core Data</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Users, lost items, found items, claims, categories, and
                  handover records.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">Security</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Authentication and role-based access help protect sensitive
                  workflow actions.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">Outcome</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Faster item recovery, better visibility, and a more reliable
                  claim process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Why TrackNest?</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Solving the common problems in lost-and-found management
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            A lost-and-found system needs more than a simple list of items. It
            needs structured reporting, searchable records, claim verification,
            staff review, and handover tracking. TrackNest connects these parts
            into one workflow that is easier to manage and easier to explain in
            a real institutional setting.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-red-500/10 p-3 text-red-600">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Problem</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Manual lost-and-found records are difficult to search, easy to
              lose, and often provide limited visibility for users and staff.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Solution</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              TrackNest provides a central platform for item reporting, item
              search, claim submission, review, and final handover.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Impact</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The system improves recovery speed, reduces confusion, and creates
              a more accountable process for returning belongings.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Core Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              What the system supports
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              The main features are designed to support both normal users and
              administrative staff while keeping the workflow simple and clear.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium text-primary">Workflow</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              A clear process from report to handover
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              TrackNest follows a simple end-to-end process. This makes the
              system easy for users to understand and easy for staff to manage
              during real lost-and-found operations.
            </p>

            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Academic value</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This project demonstrates authentication, role-based dashboards,
                CRUD operations, claim workflows, admin review, handover
                tracking, API integration, and rule-based matching concepts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>

                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">
                Rule-Based Support
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Matching support without replacing human judgement
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                TrackNest includes a smart matching section that helps compare
                lost and found item reports. It uses transparent matching
                signals such as category, color, brand, location, date, title,
                and description similarity. This helps users and staff find
                possible matches faster.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                Match scores are a recommendation helper only. Final claim
                approval and item handover decisions should always be made by
                authorised staff or administrators.
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Smart Matching Assistant
                  </p>
                  <h3 className="text-xl font-semibold">Possible Match Score</h3>
                </div>

                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  84%
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-sm font-medium">Lost Report</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Black Samsung phone lost near library
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-sm font-medium">Found Report</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Black phone found at library reception
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">
                      Category Match
                    </p>
                    <p className="mt-1 font-semibold">High</p>
                  </div>
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">
                      Location Similarity
                    </p>
                    <p className="mt-1 font-semibold">Strong</p>
                  </div>
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">
                      Color Match
                    </p>
                    <p className="mt-1 font-semibold">Matched</p>
                  </div>
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">
                      Date Relevance
                    </p>
                    <p className="mt-1 font-semibold">Close</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">User Roles</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Designed for different responsibilities
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            TrackNest separates user responsibilities so that normal users,
            staff, and administrators can access the tools relevant to their
            role.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {userRoles.map((item) => (
            <div
              key={item.role}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{item.role}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-primary p-8 text-primary-foreground shadow-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to manage lost and found items more efficiently?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
                Use the dashboard to report items, browse listings, submit
                claims, and manage the recovery process through a clean digital
                workflow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
              >
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/items"
                className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}