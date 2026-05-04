"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function ItemsSearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page"); // reset to page 1 on new search
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative max-w-sm">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9 pr-9"
        placeholder="Search items…"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={isPending}
      />
      {defaultValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
