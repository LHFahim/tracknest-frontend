import { ItemTable } from "@/components/modules/items/ItemTable";
import { ItemsSearchBar } from "@/components/modules/items/ItemsSearchBar";
import { itemService } from "@/services/item.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function PageButton({
  page,
  current,
  search,
}: {
  page: number;
  current: number;
  search: string;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  params.set("page", String(page));

  const href = `?${params.toString()}`;
  const isActive = page === current;

  return (
    <Button
      asChild
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="min-w-9 rounded-lg"
    >
      <Link href={href}>{page}</Link>
    </Button>
  );
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [lostRes, foundRes] = await Promise.all([
    itemService.getAllLostItems({ search, page, pageSize: PAGE_SIZE }),
    itemService.getAllFoundItems({ search, page, pageSize: PAGE_SIZE }),
  ]);

  const error = lostRes.error ?? foundRes.error;

  const lostTotal = lostRes.data?.pagination?.total ?? 0;
  const foundTotal = foundRes.data?.pagination?.total ?? 0;
  const maxTotal = Math.max(lostTotal, foundTotal);
  const totalPages = Math.max(1, Math.ceil(maxTotal / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Lost &amp; Found Items
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Browse reported lost and found items, check their current status,
            and open item details when needed.
          </p>
        </div>

        <Suspense>
          <ItemsSearchBar defaultValue={search} />
        </Suspense>
      </div>

      {error ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Unable to load items
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      ) : (
        <>
          <ItemTable
            lostItems={lostRes.data?.items ?? []}
            foundItems={foundRes.data?.items ?? []}
          />

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-1">
                {page > 1 && (
                  <PageButton page={page - 1} current={page} search={search} />
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(page - 2, totalPages - 4)
                  );

                  const pageNumber = start + i;

                  if (pageNumber > totalPages) return null;

                  return (
                    <PageButton
                      key={pageNumber}
                      page={pageNumber}
                      current={page}
                      search={search}
                    />
                  );
                })}

                {page < totalPages && (
                  <PageButton page={page + 1} current={page} search={search} />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}