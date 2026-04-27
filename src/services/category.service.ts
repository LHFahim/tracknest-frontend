import "server-only";

import { env } from "@/env";
import { ICategory } from "@/types/category.interface";
import { IPaginatedResponse } from "@/types/item.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const categoryService = {
  getAllCategories: async (): Promise<{
    data: ICategory[] | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/categories?pageSize=100&sortBy=createdAt&sort=desc`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["categories"] },
      });

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch categories." } };
      }

      const body = await res.json();
      // backend returns paginated response
      const items: ICategory[] = body?.items ?? body ?? [];
      return { data: items, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
