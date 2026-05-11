import { ReportLostForm } from "@/components/modules/items/ReportLostForm";
import { categoryService } from "@/services/category.service";
import Link from "next/link";

export default async function ReportLostPage() {
  const { data: categories } = await categoryService.getAllCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">Report Lost Item</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report a Lost Item
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Add clear information about the item you lost. Details like date,
          location, colour, brand, and description can help with matching and
          verification.
        </p>
      </div>

      <ReportLostForm categories={categories ?? []} />
    </div>
  );
}