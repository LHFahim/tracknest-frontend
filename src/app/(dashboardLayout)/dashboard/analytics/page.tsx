import { claimService } from "@/services/claim.service";
import { handoverService } from "@/services/handover.service";
import { itemService } from "@/services/item.service";
import { userService } from "@/services/user.service";
import {
  ClaimStatus,
} from "@/types/claim.interface";
import {
  FoundItemStatus,
  LostItemStatus,
} from "@/types/item.interface";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  PackageSearch,
  Users,
  ArrowLeftRight,
} from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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

// ─── Breakdown bar ────────────────────────────────────────────────────────────

function BreakdownBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label.replace(/_/g, " ")}</span>
        <span className="font-medium text-foreground">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const { data: session } = await userService.getSession();
  if (!session?.user) redirect("/login");

  const isAdmin =
    session.user.role === "SUPER_ADMIN" ||
    session.user.role === "ADMIN" ||
    session.user.role === "STAFF";

  // Fetch all data in parallel
  const [lostRes, foundRes, claimsRes, handoversRes, usersRes] =
    await Promise.all([
      itemService.getAllLostItems({ pageSize: 1000 }),
      itemService.getAllFoundItems({ pageSize: 1000 }),
      isAdmin ? claimService.adminGetAllClaims() : claimService.getMyClaims(),
      isAdmin
        ? handoverService.adminGetAllHandovers()
        : handoverService.getMyHandovers(),
      isAdmin ? userService.getAllUsers() : Promise.resolve({ data: null }),
    ]);

  const lostItems = lostRes.data?.items ?? [];
  const foundItems = foundRes.data?.items ?? [];
  const claims = claimsRes.data?.items ?? [];
  const handovers = handoversRes.data?.items ?? [];
  const totalUsers = isAdmin
    ? (usersRes.data?.pagination?.total ?? usersRes.data?.items?.length ?? 0)
    : 0;

  const totalLost = lostRes.data?.pagination?.total ?? lostItems.length;
  const totalFound = foundRes.data?.pagination?.total ?? foundItems.length;
  const totalClaims = claimsRes.data?.pagination?.total ?? claims.length;
  const totalHandovers = handoversRes.data?.pagination?.total ?? handovers.length;

  // Lost item status counts
  const lostStatusCounts = Object.values(LostItemStatus).reduce(
    (acc, s) => ({
      ...acc,
      [s]: lostItems.filter((i) => i.status === s).length,
    }),
    {} as Record<LostItemStatus, number>
  );

  // Found item status counts
  const foundStatusCounts = Object.values(FoundItemStatus).reduce(
    (acc, s) => ({
      ...acc,
      [s]: foundItems.filter((i) => i.status === s).length,
    }),
    {} as Record<FoundItemStatus, number>
  );

  // Claim status counts
  const claimStatusCounts = Object.values(ClaimStatus).reduce(
    (acc, s) => ({
      ...acc,
      [s]: claims.filter((c) => c.status === s).length,
    }),
    {} as Record<ClaimStatus, number>
  );

  // Recovery rate: approved claims / total found items
  const approvedClaims = claimStatusCounts[ClaimStatus.APPROVED] ?? 0;
  const recoveryRate =
    totalFound > 0 ? Math.round((approvedClaims / totalFound) * 100) : 0;

  const lostBarColors: Record<LostItemStatus, string> = {
    [LostItemStatus.OPEN]: "bg-blue-500",
    [LostItemStatus.CLAIM_REQUESTED]: "bg-yellow-500",
    [LostItemStatus.CLAIM_APPROVED]: "bg-green-500",
    [LostItemStatus.CLAIM_REJECTED]: "bg-red-500",
    [LostItemStatus.CLOSED]: "bg-gray-400",
  };

  const foundBarColors: Record<FoundItemStatus, string> = {
    [FoundItemStatus.REPORTED]: "bg-blue-500",
    [FoundItemStatus.IN_CUSTODY]: "bg-purple-500",
    [FoundItemStatus.READY_FOR_HANDOVER]: "bg-yellow-500",
    [FoundItemStatus.RETURNED]: "bg-green-500",
    [FoundItemStatus.UNCLAIMED]: "bg-orange-500",
    [FoundItemStatus.DISPOSED]: "bg-red-500",
  };

  const claimBarColors: Record<ClaimStatus, string> = {
    [ClaimStatus.PENDING]: "bg-yellow-500",
    [ClaimStatus.UNDER_REVIEW]: "bg-blue-500",
    [ClaimStatus.APPROVED]: "bg-green-500",
    [ClaimStatus.REJECTED]: "bg-red-500",
    [ClaimStatus.CANCELED]: "bg-gray-400",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Platform statistics and recovery metrics
          </p>
        </div>
      </div>

      {/* Summary stats */}
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
          label="Total Claims"
          value={totalClaims}
          icon={ClipboardList}
          sub="Submitted claims"
        />
        <StatCard
          label="Total Handovers"
          value={totalHandovers}
          icon={ArrowLeftRight}
          sub="Completed handovers"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Recovery Rate"
          value={`${recoveryRate}%`}
          icon={CheckCircle2}
          sub="Approved claims / found items"
        />
        <StatCard
          label="Approved Claims"
          value={approvedClaims}
          icon={CheckCircle2}
          sub="Successfully resolved"
        />
        {isAdmin && (
          <StatCard
            label="Registered Users"
            value={totalUsers}
            icon={Users}
            sub="All accounts"
          />
        )}
      </div>

      {/* Breakdown charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lost items by status */}
        <SectionCard title="Lost Items by Status">
          {Object.values(LostItemStatus).map((s) => (
            <BreakdownBar
              key={s}
              label={s}
              count={lostStatusCounts[s]}
              total={lostItems.length || 1}
              color={lostBarColors[s]}
            />
          ))}
        </SectionCard>

        {/* Found items by status */}
        <SectionCard title="Found Items by Status">
          {Object.values(FoundItemStatus).map((s) => (
            <BreakdownBar
              key={s}
              label={s}
              count={foundStatusCounts[s]}
              total={foundItems.length || 1}
              color={foundBarColors[s]}
            />
          ))}
        </SectionCard>

        {/* Claims by status */}
        <SectionCard title="Claims by Status">
          {Object.values(ClaimStatus).map((s) => (
            <BreakdownBar
              key={s}
              label={s}
              count={claimStatusCounts[s]}
              total={claims.length || 1}
              color={claimBarColors[s]}
            />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
