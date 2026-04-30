"use client";

import { DeleteUserButton } from "@/components/modules/users/DeleteUserButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/types/user.interface";

const panelTypeLabel: Record<string, string> = {
  ADMIN: "Super Admin",
  STAFF: "Staff",
  NORMAL_USER: "User",
};

const panelTypeVariant: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  STAFF: "outline",
  NORMAL_USER: "secondary",
};

export function UserTable({ users }: { users: IUser[] }) {
  return (
    <div className="border rounded-md p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={panelTypeVariant[user.panelType] ?? "secondary"}>
                    {panelTypeLabel[user.panelType] ?? user.panelType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "outline" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{user.phone ?? "N/A"}</TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteUserButton
                    userId={user.id}
                    userName={`${user.firstName} ${user.lastName}`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
