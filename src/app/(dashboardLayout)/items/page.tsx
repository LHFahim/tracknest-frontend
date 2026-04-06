import { ItemTable } from "@/components/modules/items/ItemTable";
import { itemService } from "@/services/item.service";

export default async function ItemsPage() {
  const [lostRes, foundRes] = await Promise.all([
    itemService.getAllLostItems(),
    itemService.getAllFoundItems(),
  ]);

  const error = lostRes.error ?? foundRes.error;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Lost &amp; Found Items</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse and manage all reported lost and found items.
        </p>
      </div>

      {error ? (
        <div className="border rounded-md p-8 text-center text-muted-foreground">
          {error.message}
        </div>
      ) : (
        <ItemTable
          lostItems={lostRes.data?.items ?? []}
          foundItems={foundRes.data?.items ?? []}
        />
      )}
    </div>
  );
}
