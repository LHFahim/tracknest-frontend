import { DeleteUserButton } from "@/components/modules/users/DeleteUserButton";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
import { IUser } from "@/types/user.interface";

export const dynamic = "force-dynamic";

const panelTypeLabel: Record<string, string> = {
  ADMIN: "Super Admin",
  STAFF: "Staff",
  NORMAL_USER: "User",
};

const panelTypeVariant: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  ADMIN: "default",
  STAFF: "outline",
  NORMAL_USER: "secondary",
};

export default async function UsersPage() {
  const { data, error } = await userService.getAllUsers();

  const users = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all registered users
          </p>
        </div>
        {data?.pagination && (
          <span className="text-sm text-muted-foreground">
            {data.pagination.total} total
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {users.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No users found.
        </div>
      )}

      {users.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: IUser, i: number) => (
                <tr
                  key={user.id}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "" : "bg-muted/20"
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        panelTypeVariant[user.panelType] ?? "secondary"
                      }
                    >
                      {panelTypeLabel[user.panelType] ?? user.panelType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge
                      variant={user.isActive ? "outline" : "destructive"}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteUserButton
                        userId={user.id}
                        userName={`${user.firstName} ${user.lastName}`}
                      />
                    </div>
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
