"use server";

import { itemService } from "@/services/item.service";
import { CustodyType, FoundItemStatus, LostItemStatus } from "@/types/item.interface";
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

export const updateLostItem = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    category?: string;
    dateLost?: string;
    locationLost?: string;
    brand?: string;
    color?: string;
    imageURL?: string;
  }
) => {
  const res = await itemService.updateLostItem(id, payload);
  if (!res.error) revalidateTag("items", {});
  return res;
};

export const updateFoundItem = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    category?: string;
    dateFound?: string;
    locationFound?: string;
    custodyType?: string;
    brand?: string;
    color?: string;
    identifyingDetails?: string;
    images?: string[];
  }
) => {
  const res = await itemService.updateFoundItem(id, payload);
  if (!res.error) revalidateTag("items", {});
  return res;
};

export const createLostItem = async (payload: {
  title: string;
  description: string;
  category: string;
  dateLost: string;
  locationLost?: string;
  brand?: string;
  color?: string;
  imageURL?: string;
}) => {
  const res = await itemService.createLostItem(payload);
  if (res.data) revalidateTag("items", {});
  return res;
};

export const createFoundItem = async (payload: {
  title: string;
  description: string;
  category: string;
  dateFound: string;
  custodyType: CustodyType;
  locationFound?: string;
  brand?: string;
  color?: string;
  identifyingDetails?: string;
  images?: string[];
}) => {
  const res = await itemService.createFoundItem(payload);
  if (res.data) revalidateTag("items", {});
  return res;
};
