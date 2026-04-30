import { CategoryForm } from "@/components/modules/categories/CategoryForm";
import { DeleteCategoryButton } from "@/components/modules/categories/DeleteCategoryButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { data: categories, error } = await categoryService.adminGetAllCategories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage item categories used across lost &amp; found reports
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left — category list */}
        <div className="space-y-3">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error.message}
            </div>
          )}

          {categories && categories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
              No categories yet. Create the first one →
            </div>
          )}

          {categories && categories.length > 0 && (
            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                      Icon
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                      Colour
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr
                      key={cat.id}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {cat.slug}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {cat.icon ?? "—"}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {cat.color ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-sm border border-border"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-mono text-xs text-muted-foreground">
                              {cat.color}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={cat.isActive ? "outline" : "secondary"}>
                          {cat.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <DeleteCategoryButton id={cat.id} name={cat.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right — create form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
