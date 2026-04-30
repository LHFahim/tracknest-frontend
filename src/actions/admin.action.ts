"use server";

import { claimService } from "@/services/claim.service";
import { handoverService } from "@/services/handover.service";
import { userService } from "@/services/user.service";
import { revalidateTag } from "next/cache";

// ─── Claims ───────────────────────────────────────────────────────────────────

export async function reviewClaim(
  claimId: string,
  payload: { status: string; reviewComment?: string }
) {
  const result = await claimService.adminUpdateClaimStatus(claimId, payload);
  if (!result.error) {
    revalidateTag("claims", {});
  }
  return result;
}

// ─── Handovers ────────────────────────────────────────────────────────────────

export async function createHandover(payload: {
  foundItem: string;
  receivedByUser: string;
  note?: string;
}) {
  const result = await handoverService.adminCreateHandover(payload);
  if (!result.error) {
    revalidateTag("handovers", {});
    revalidateTag("items", {});
  }
  return result;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function deleteUser(userId: string) {
  const result = await userService.deleteUser(userId);
  if (!result.error) {
    revalidateTag("users", {});
  }
  return result;
}
