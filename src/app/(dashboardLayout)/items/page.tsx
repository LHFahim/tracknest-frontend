import { ItemTable } from "@/components/modules/items/ItemTable";
import { ItemsSearchBar } from "@/components/modules/items/ItemsSearchBar";
import { itemService } from "@/services/item.service";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function PageButton({
  page,
  current,
  search,
  extraParams = {},
}: {
  page: number;
  current: number;
  search: string;
  extraParams?: Record<string, string>;
}) {
  const params = new URLSearchParams(extraParams);
  if (search) params.set("search", search);
  params.set("page", String(page));
  const isActive = page === current;
  return (
    <Button
      asChild
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="min-w-8"
    >
      <Link href={`?${params.toString()}`}>{page}</Link>
    </Button>
  );
}

function Pagination({
  page,
  totalPages,
  search,
  extraParams = {},
}: {
  page: number;
  totalPages: number;
  search: string;
  extraParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <PageButton page={page - 1} current={page} search={search} extraParams={extraParams} />
        )}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const start = Math.max(1, Math.min(page - 2, totalPages - 4));
          const p = start + i;
          if (p > totalPages) return null;
          return (
            <PageButton key={p} page={p} current={page} search={search} extraParams={extraParams} />
          );
        })}
        {page < totalPages && (
          <PageButton page={page + 1} current={page} search={search} extraParams={extraParams} />
        )}
      </div>
    </div>
  );
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; type?: string }>;
}) {
  const { search = "", page: pageParam, type } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const sessionRes = await userService.getSession();
  const role = sessionRes.data?.user?.role as string | undefined;
  const isAdminOrStaff = role === "ADMIN" || role === "STAFF";

  // Staff / Admin: show ALL lost + ALL found in two separate sections
  if (isAdminOrStaff) {
    const [lostRes, foundRes] = await Promise.all([
      itemService.getAllLostItems({ search, page, pageSize: PAGE_SIZE }),
      itemService.getAllFoundItems({ search, page, pageSize: PAGE_SIZE }),
    ]);

    const error = lostRes.error ?? foundRes.error;
    const lostTotal = lostRes.data?.pagination?.total ?? 0;
    const foundTotal = foundRes.data?.pagination?.total ?? 0;
    const lostPages = Math.max(1, Math.ceil(lostTotal / PAGE_SIZE));
    const foundPages = Math.max(1, Math.ceil(foundTotal / PAGE_SIZE));

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Lost &amp; Found Items</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse and manage all reported lost and found items.
            </p>
          </div>
          <Suspense>
            <ItemsSearchBar defaultValue={search} />
          </Suspense>
        </div>

        {error ? (
          <div className="border rounded-md p-8 text-center text-muted-foreground">
            {error.message}
          </div>
        ) : (
          <>
            {/* Lost Reports section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">
                Lost Reports{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({lostTotal})
                </span>
              </h2>
              <ItemTable
                lostItems={lostRes.data?.items ?? []}
                foundItems={[]}
                role={role}
              />
              <Pagination page={page} totalPages={lostPages} search={search} />
            </div>

            {/* Found Items section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">
                Found Items{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({foundTotal})
                </span>
              </h2>
              <ItemTable
                lostItems={[]}
                foundItems={foundRes.data?.items ?? []}
                role={role}
              />
              <Pagination page={page} totalPages={foundPages} search={search} />
            </div>
          </>
        )}
      </div>
    );
  }

  // Normal User: their own lost reports, or browse found items for claiming
  const showFound = type === "found";

  const [lostRes, foundRes] = await Promise.all([
    showFound
      ? Promise.resolve({ data: null, error: null })
      : itemService.getAllLostItems({ search, page, pageSize: PAGE_SIZE }),
    showFound
      ? itemService.getAllFoundItems({ search, page, pageSize: PAGE_SIZE })
      : Promise.resolve({ data: null, error: null }),
  ]);

  const error = lostRes.error ?? foundRes.error;
  const total = showFound
    ? (foundRes.data?.pagination?.total ?? 0)
    : (lostRes.data?.pagination?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            {showFound ? "Found Items" : "My Lost Reports"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {showFound
              ? "Browse all reported found items — claim one if it's yours."
              : "All lost item reports you have submitted."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            <Button asChild variant={!showFound ? "default" : "outline"} size="sm">
              <Link href="/items">My Lost Reports</Link>
            </Button>
            <Button asChild variant={showFound ? "default" : "outline"} size="sm">
              <Link href="/items?type=found">Browse Found Items</Link>
            </Button>
          </div>
          <Suspense>
            <ItemsSearchBar defaultValue={search} />
          </Suspense>
        </div>
      </div>

      {error ? (
        <div className="border rounded-md p-8 text-center text-muted-foreground">
          {error.message}
        </div>
      ) : (
        <>
          <ItemTable
            lostItems={lostRes.data?.items ?? []}
            foundItems={foundRes.data?.items ?? []}
            role={role}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            search={search}
            extraParams={showFound ? { type: "found" } : {}}
          />
        </>
      )}
    </div>
  );
}
