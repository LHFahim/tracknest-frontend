import { Bell, ClipboardList, PackageSearch, ShieldCheck, Users } from 'lucide-react';

const stats = [
  { title: 'Lost Reports', value: '124', note: '+12 this week', icon: ClipboardList },
  { title: 'Found Reports', value: '98', note: '+8 this week', icon: PackageSearch },
  { title: 'Active Claims', value: '27', note: '6 pending review', icon: ShieldCheck },
  { title: 'Registered Users', value: '342', note: '+24 this month', icon: Users },
];

const recentActivities = [
  {
    title: 'Black Backpack matched',
    subtitle: 'Matched with lost report near Library',
    status: 'Matched',
  },
  {
    title: 'Student ID submitted',
    subtitle: 'New claim awaiting verification',
    status: 'Pending',
  },
  {
    title: 'Water Bottle reported',
    subtitle: 'Reported by campus reception desk',
    status: 'New',
  },
];

export default function DashboardOverview() {
  return (
    <section className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Demo Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight">TrackNest Overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A preview of system activity, reports, and claims for demonstration and reporting.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold">{item.value}</h3>
                <p className="mt-1 text-xs text-emerald-600">{item.note}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">
                Latest updates from the lost and found workflow.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Quick Summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Snapshot for your academic report.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Recovery Rate</p>
                <p className="mt-2 text-2xl font-bold">78%</p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Average Match Time</p>
                <p className="mt-2 text-2xl font-bold">2.3 Days</p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">Pending Admin Reviews</p>
                <p className="mt-2 text-2xl font-bold">9</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}