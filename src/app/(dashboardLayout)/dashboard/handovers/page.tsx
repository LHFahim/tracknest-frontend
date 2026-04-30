import { CreateHandoverForm } from "@/components/modules/handovers/CreateHandoverForm";
import { handoverService } from "@/services/handover.service";

export const dynamic = "force-dynamic";

export default async function AdminHandoversPage() {
  const { data, error } = await handoverService.adminGetAllHandovers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Handovers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record and view all item handovers to users
          </p>
        </div>
        <CreateHandoverForm />
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No handovers recorded yet.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Found Item
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Received By
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Handed Over By
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Note
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((h, i) => (
                <tr
                  key={h.id}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "" : "bg-muted/20"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {h.foundItem}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {h.receivedByUser}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                    {h.handedOverBy}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {h.note ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(h.handedOverAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
