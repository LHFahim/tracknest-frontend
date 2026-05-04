import { EditLostItemForm } from "@/components/modules/items/EditLostItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryService } from "@/services/category.service";
import { itemService } from "@/services/item.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditLostItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [itemRes, catRes] = await Promise.all([
    itemService.getLostItemById(id),
    categoryService.getAllCategories(),
  ]);

  if (!itemRes.data) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Lost Item</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your lost item report</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{itemRes.data.title}</CardTitle></CardHeader>
        <CardContent>
          <EditLostItemForm item={itemRes.data} categories={catRes.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
