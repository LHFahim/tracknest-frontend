import { userService } from "@/services/user.service";
import { itemService } from "@/services/item.service";
import { redirect } from "next/navigation";
import { RolesEnum } from "@/constants/role";
import Link from "next/link";
import {
  Users,
  PackageSearch,
  PackageCheck,
  FileText,
  FolderOpen,
  ClipboardList,
  PlusCircle,
  SearchCheck,
  Tag,
  BarChart3,
  ShieldAlert,
  Eye,
} from "lucide-react";

// ─── Shared stat card ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  className = "",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Quick-action card ────────────────────────────────────────────────────────

function ActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/15">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Role dashboards ──────────────────────────────────────────────────────────

async function AdminDashboard({ name }: { name: string }) {
  const [lostRes, foundRes] = await Promise.all([
    itemService.getAllLostItems(),
    itemService.getAllFoundItems(),
  ]);

  const totalLost = lostRes.data?.pagination?.total ?? 0;
  const totalFound = foundRes.data?.pagination?.total ?? 0;
  const openClaims =
    lostRes.data?.items?.filter((i) => i.status === "CLAIM_REQUESTED").length ??
    0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Super Admin dashboard for reviewing system activity and managing key
          platform areas.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Lost Reports"
          value={totalLost}
          icon={PackageSearch}
          sub="All time"
        />
        <StatCard
          label="Total Found Reports"
          value={totalFound}
          icon={PackageCheck}
          sub="All time"
        />
        <StatCard
          label="Open Claims"
          value={openClaims}
          icon={ClipboardList}
          sub="Awaiting review"
        />
        <StatCard
          label="Active Items"
          value={totalLost + totalFound}
          icon={FolderOpen}
          sub="Lost and found combined"
        />
      </div>

      {/* Quick actions */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, categories, reports, analytics, and system controls.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Manage Users"
            description="View, ban, or update user accounts."
            href="/dashboard/users"
            icon={Users}
          />
          <ActionCard
            title="Manage Categories"
            description="Add, edit, or remove item categories."
            href="/dashboard/categories"
            icon={Tag}
          />
          <ActionCard
            title="All Items"
            description="Browse all reported lost and found items."
            href="/items"
            icon={PackageSearch}
          />
          <ActionCard
            title="Reports"
            description="Review item reports and manage visibility."
            href="/dashboard/reports"
            icon={FileText}
          />
          <ActionCard
            title="Analytics"
            description="View platform statistics and recovery insights."
            href="/dashboard/analytics"
            icon={BarChart3}
          />
          <ActionCard
            title="Security"
            description="Review audit logs and access control areas."
            href="/dashboard/security"
            icon={ShieldAlert}
          />
        </div>
      </div>
    </div>
  );
}

async function StaffDashboard({ name }: { name: string }) {
  const [lostRes, foundRes] = await Promise.all([
    itemService.getAllLostItems(),
    itemService.getAllFoundItems(),
  ]);

  const totalLost = lostRes.data?.pagination?.total ?? 0;
  const totalFound = foundRes.data?.pagination?.total ?? 0;
  const openClaims =
    lostRes.data?.items?.filter((i) => i.status === "CLAIM_REQUESTED").length ??
    0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Staff dashboard for reviewing item reports, claims, users, and
          categories.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Lost Reports"
          value={totalLost}
          icon={PackageSearch}
          sub="Currently recorded"
        />
        <StatCard
          label="Found Reports"
          value={totalFound}
          icon={PackageCheck}
          sub="Currently recorded"
        />
        <StatCard
          label="Pending Claims"
          value={openClaims}
          icon={ClipboardList}
          sub="Needs review"
        />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review user accounts, reports, categories, and item records.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Manage Users"
            description="View and manage registered user accounts."
            href="/dashboard/users"
            icon={Users}
          />
          <ActionCard
            title="Manage Categories"
            description="Create and update item categories."
            href="/dashboard/categories"
            icon={Tag}
          />
          <ActionCard
            title="All Items"
            description="Review all lost and found item records."
            href="/items"
            icon={PackageSearch}
          />
          <ActionCard
            title="Reports"
            description="Check item reports and update visibility."
            href="/dashboard/reports"
            icon={Eye}
          />
        </div>
      </div>
    </div>
  );
}

function UserDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Report lost or found items, browse listings, and keep track of your
          activity in one place.
        </p>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose an option below to continue with your lost and found task.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Report a Lost Item"
            description="Create a report with item details, date, and location."
            href="/dashboard/report-lost"
            icon={PlusCircle}
          />
          <ActionCard
            title="Report a Found Item"
            description="Record a found item so the owner can identify it."
            href="/dashboard/report-found"
            icon={PackageCheck}
          />
          <ActionCard
            title="Browse Items"
            description="Search all reported lost and found item listings."
            href="/items"
            icon={SearchCheck}
          />
          <ActionCard
            title="My Lost Reports"
            description="View and update the items you reported as lost."
            href="/dashboard/my-lost-items"
            icon={PackageSearch}
          />
          <ActionCard
            title="My Found Reports"
            description="View and update the items you reported as found."
            href="/dashboard/my-found-items"
            icon={FolderOpen}
          />
          <ActionCard
            title="My Claims"
            description="Track your submitted claims and their current status."
            href="/dashboard/my-claims"
            icon={ClipboardList}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const { data } = await userService.getSession();
  if (!data?.user) redirect("/login");

  const user = data.user;
  const name = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.email ?? "there";

  switch (user.role) {
    case RolesEnum.ADMIN:
      return <AdminDashboard name={name} />;
    case RolesEnum.STAFF:
      return <StaffDashboard name={name} />;
    default:
      return <UserDashboard name={name} />;
  }
}