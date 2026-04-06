import { ItemDetail } from "@/components/modules/items/ItemDetail";
import { itemService } from "@/services/item.service";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ItemViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: item, error } = await itemService.getItemById(id);

  if (!item || error?.message === "Item not found.") {
    notFound();
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb id={id} title="Error" />
        <div className="border rounded-md p-8 text-center text-muted-foreground">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb id={id} title={item.title} />
      <ItemDetail item={item} />
    </div>
  );
}

function Breadcrumb({ id, title }: { id: string; title: string }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <span>/</span>
      <Link href="/items" className="hover:text-foreground">
        Items
      </Link>
      <span>/</span>
      <span className="text-foreground truncate max-w-[200px]">{title}</span>
    </nav>
  );
}
