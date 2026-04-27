"use server";

import { claimService } from "@/services/claim.service";
import { revalidateTag } from "next/cache";

export const createClaim = async (payload: {
  foundItemId: string;
  message: string;
  images: string[];
  lostItemId?: string;
}) => {
  const res = await claimService.createClaim(payload);
  if (res.data) revalidateTag("claims", {});
  return res;
};

export const withdrawClaim = async (claimId: string) => {
  const res = await claimService.withdrawClaim(claimId);
  if (res.data) revalidateTag("claims", {});
  return res;
};
