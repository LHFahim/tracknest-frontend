import { CheckCircle2, Search, ShieldCheck, Users } from 'lucide-react';

const features = [
  {
    title: 'Lost and Found Reporting',
    description:
      'Users can quickly report lost or found items with structured details such as category, location, date, and description.',
    icon: CheckCircle2,
  },
  {
    title: 'Smart Item Matching',
    description:
      'The system supports lightweight matching using category similarity, keyword overlap, and location-based relevance.',
    icon: Search,
  },
  {
    title: 'Secure Claim Verification',
    description:
      'Ownership claims can be reviewed through a controlled workflow to reduce incorrect handovers and improve trust.',
    icon: ShieldCheck,
  },
  {
    title: 'Institutional Support',
    description:
      'The platform is designed for universities, offices, and campuses where lost property handling needs to be organized and scalable.',
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">About TrackNest</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              A smarter way to manage lost and found items
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              TrackNest is a Lost and Found Management System designed for
              institutional environments such as universities, offices, and
              public facilities. It helps users report missing items, submit
              found items, monitor claim activity, and improve recovery through
              a clear and structured workflow.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-semibold">Project Overview</h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Problem</p>
                <p className="mt-2 font-medium">
                  Lost and found processes are often manual, inconsistent, and
                  difficult to track.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Solution</p>
                <p className="mt-2 font-medium">
                  TrackNest centralizes reporting, matching, verification, and
                  monitoring in one digital platform.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Target Users</p>
                <p className="mt-2 font-medium">
                  Students, staff, reception teams, administrators, and campus
                  security personnel.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Why this system matters</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Improving recovery, trust, and visibility
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Traditional lost and found handling usually depends on fragmented
              records, verbal communication, or manual storage logs. This creates
              delays, confusion, and weak accountability. TrackNest improves this
              process through digital reporting, searchable item records, claim
              verification support, and a unified dashboard for monitoring
              activity.
            </p>
          </div>
        </div>

        <div>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Core Features</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Key capabilities of the platform
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-primary">Step 1</p>
            <h3 className="mt-2 text-lg font-semibold">Report an item</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              A user submits a lost or found report with essential details
              including item category, location, time, and description.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-primary">Step 2</p>
            <h3 className="mt-2 text-lg font-semibold">Review and match</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The system compares item details and supports staff in reviewing
              potential matches and related reports.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-primary">Step 3</p>
            <h3 className="mt-2 text-lg font-semibold">Verify claim</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Ownership claims are checked before item release to maintain a
              secure and accountable recovery process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}