import { Navbar } from "@/components/layout/Navbar";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const isLoggedIn = !!data?.user;

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      {children}
    </div>
  );
}
