"use server";

import { itemService } from "@/services/item.service";
import { FoundItemStatus, LostItemStatus } from "@/types/item.interface";
import { revalidateTag } from "next/cache";

export const deleteLostItem = async (id: string) => {
  const res = await itemService.deleteLostItem(id);
  revalidateTag("items", {});
  return res;
};

export const deleteFoundItem = async (id: string) => {
  const res = await itemService.deleteFoundItem(id);
  revalidateTag("items", {});
  return res;
};

export const updateLostItemStatus = async (id: string, status: LostItemStatus) => {
  const res = await itemService.updateLostItemStatus(id, status);
  revalidateTag("items", {});
  return res;
};

export const updateFoundItemStatus = async (id: string, status: FoundItemStatus) => {
  const res = await itemService.updateFoundItemStatus(id, status);
  revalidateTag("items", {});
  return res;
};
