import { EditProfileForm } from "@/components/modules/profile/EditProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { data, error } = await userService.getSession();

  if (!data || error) redirect("/login");

  const { user } = data;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm
            initialValues={{
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
              email: user.email ?? "",
              phone: user.phone ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
