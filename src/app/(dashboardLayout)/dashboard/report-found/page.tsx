import { ReportFoundForm } from "@/components/modules/items/ReportFoundForm";
import { categoryService } from "@/services/category.service";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportFoundPage() {
  const { data: session } = await userService.getSession();
  if (session?.user?.role === "NORMAL_USER") {
    redirect("/dashboard");
  }

  const { data: categories } = await categoryService.getAllCategories();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <span>/</span>
        <span className="text-foreground">Report Found Item</span>
      </nav>

      <ReportFoundForm categories={categories ?? []} />
    </div>
  );
}
