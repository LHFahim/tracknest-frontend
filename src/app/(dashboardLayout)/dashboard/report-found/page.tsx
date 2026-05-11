import { ReportFoundForm } from "@/components/modules/items/ReportFoundForm";
import { categoryService } from "@/services/category.service";
import Link from "next/link";

export default async function ReportFoundPage() {
  const { data: categories } = await categoryService.getAllCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground">Report Found Item</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report a Found Item
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Add clear details about the item you found. This helps the owner
          identify it and supports the claim verification process.
        </p>
      </div>

      <ReportFoundForm categories={categories ?? []} />
    </div>
  );
}