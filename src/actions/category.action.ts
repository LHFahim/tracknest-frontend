"use server";

import { categoryService } from "@/services/category.service";
import { revalidateTag } from "next/cache";

export async function createCategory(payload: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  const result = await categoryService.adminCreateCategory(payload);
  if (!result.error) {
    revalidateTag("categories", {});
  }
  return result;
}

export async function updateCategory(
  id: string,
  payload: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  const result = await categoryService.adminUpdateCategory(id, payload);
  if (!result.error) {
    revalidateTag("categories", {});
  }
  return result;
}

export async function deleteCategory(id: string) {
  const result = await categoryService.adminDeleteCategory(id);
  if (!result.error) {
    revalidateTag("categories", {});
  }
  return result;
}
