"use server";

import { itemService } from "@/services/item.service";
import { IItem } from "@/types/item.interface";
import { revalidateTag } from "next/cache";

export const deleteItem = async (id: string) => {
  const res = await itemService.deleteItem(id);
  revalidateTag("items");
  return res;
};

export const updateItemStatus = async (
  id: string,
  status: IItem["status"]
) => {
  const res = await itemService.updateItem(id, { status });
  revalidateTag("items");
  return res;
};

export const createItem = async (
  payload: Omit<IItem, "id" | "reportedBy" | "createdAt" | "updatedAt">
) => {
  const res = await itemService.createItem(payload);
  revalidateTag("items");
  return res;
};
