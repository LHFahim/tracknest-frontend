import { ItemDetail } from "@/components/modules/items/ItemDetail";
import { itemService } from "@/services/item.service";
import { claimService } from "@/services/claim.service";
import { userService } from "@/services/user.service";
import { ClaimStatus } from "@/types/claim.interface";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ItemViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [result, sessionResult, claimsResult] = await Promise.all([
    itemService.getItemById(id),
    userService.getSession(),
    claimService.getMyClaims(),
  ]);

  if (!result.data) {
    notFound();
  }

  const item = result.data;
  const role = sessionResult.data?.user?.role as string | undefined;
  const userId = sessionResult.data?.user?.id as string | undefined;

  // Check if this user already has an active claim on this found item
  const existingClaim = claimsResult.data?.items?.find(
    (c) =>
      c.foundItemId === id &&
      c.status !== ClaimStatus.CANCELED
  );

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb title={item.title} />
      <ItemDetail item={item} role={role} userId={userId} existingClaimId={existingClaim?.id} />
    </div>
  );
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <span>/</span>
      <Link href="/items" className="hover:text-foreground">
        Items
      </Link>
      <span>/</span>
      <span className="text-foreground truncate max-w-[200px]">{title}</span>
    </nav>
  );
}
