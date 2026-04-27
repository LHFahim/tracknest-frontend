import { ReportLostForm } from "@/components/modules/items/ReportLostForm";
import { categoryService } from "@/services/category.service";
import Link from "next/link";

export default async function ReportLostPage() {
  const { data: categories } = await categoryService.getAllCategories();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground">Report Lost Item</span>
      </nav>

      <ReportLostForm categories={categories ?? []} />
    </div>
  );
}
