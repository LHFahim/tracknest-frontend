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
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

// ─── Role dashboards ──────────────────────────────────────────────────────────

async function AdminDashboard({
  name,
}: {
  name: string;
}) {
  const [lostRes, foundRes] = await Promise.all([
    itemService.getAllLostItems(),
    itemService.getAllFoundItems(),
  ]);

  const totalLost = lostRes.data?.pagination?.total ?? 0;
  const totalFound = foundRes.data?.pagination?.total ?? 0;
  const openClaims =
    lostRes.data?.items?.filter(
      (i) => i.status === "CLAIM_REQUESTED"
    ).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Super Admin — full system overview
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
          sub="Combined"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Manage Users"
            description="View, ban, or update user accounts"
            href="/dashboard/users"
            icon={Users}
          />
          <ActionCard
            title="Manage Categories"
            description="Add, edit, or remove item categories"
            href="/dashboard/categories"
            icon={Tag}
          />
          <ActionCard
            title="All Items"
            description="Browse all lost & found reports"
            href="/items"
            icon={PackageSearch}
          />
          <ActionCard
            title="Reports"
            description="View and toggle item report visibility"
            href="/dashboard/reports"
            icon={FileText}
          />
          <ActionCard
            title="Analytics"
            description="Platform stats and recovery metrics"
            href="/dashboard/analytics"
            icon={BarChart3}
          />
          <ActionCard
            title="Security"
            description="Audit logs and access controls"
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
    lostRes.data?.items?.filter(
      (i) => i.status === "CLAIM_REQUESTED"
    ).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Staff — manage items, users and categories
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Lost Reports"
          value={totalLost}
          icon={PackageSearch}
        />
        <StatCard
          label="Found Reports"
          value={totalFound}
          icon={PackageCheck}
        />
        <StatCard
          label="Pending Claims"
          value={openClaims}
          icon={ClipboardList}
          sub="Needs action"
        />
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Manage Users"
            description="View and manage user accounts"
            href="/dashboard/users"
            icon={Users}
          />
          <ActionCard
            title="Manage Categories"
            description="Create and edit item categories"
            href="/dashboard/categories"
            icon={Tag}
          />
          <ActionCard
            title="All Items"
            description="Review all lost & found reports"
            href="/items"
            icon={PackageSearch}
          />
          <ActionCard
            title="Reports"
            description="Toggle visibility of item reports"
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
          Browse items, report losses, and manage your claims
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          What would you like to do?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Report a Lost Item"
            description="Submit a report for something you've lost"
            href="/dashboard/report-lost"
            icon={PlusCircle}
          />
          <ActionCard
            title="Report a Found Item"
            description="Let others know you've found something"
            href="/dashboard/report-found"
            icon={PackageCheck}
          />
          <ActionCard
            title="Browse Items"
            description="Search all lost & found listings"
            href="/items"
            icon={SearchCheck}
          />
          <ActionCard
            title="My Lost Reports"
            description="Track items you've reported missing"
            href="/dashboard/my-lost-items"
            icon={PackageSearch}
          />
          <ActionCard
            title="My Found Reports"
            description="Items you've reported finding"
            href="/dashboard/my-found-items"
            icon={FolderOpen}
          />
          <ActionCard
            title="My Claims"
            description="Check the status of your claims"
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
    : (user.email ?? "there");

  switch (user.role) {
    case RolesEnum.ADMIN:
      return <AdminDashboard name={name} />;
    case RolesEnum.STAFF:
      return <StaffDashboard name={name} />;
    default:
      return <UserDashboard name={name} />;
  }
}
