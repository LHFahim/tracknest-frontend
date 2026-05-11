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
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Review and update the contact details used for item reports, claims,
            and handover communication.
          </p>
        </div>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">Account Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Keep your basic details up to date so staff can contact you if
              needed.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
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
    </div>
  );
}