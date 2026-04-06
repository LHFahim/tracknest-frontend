import { RegisterForm } from "@/components/modules/authentication/register-form";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data } = await userService.getSession();
  if (data?.user) redirect("/");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
