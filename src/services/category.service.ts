import "server-only";

import { env } from "@/env";
import { ICategory } from "@/types/category.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const categoryService = {
  // ─── Public / regular user ────────────────────────────────────────────────

  getAllCategories: async (): Promise<{
    data: ICategory[] | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/categories?pageSize=100&sortBy=createdAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { tags: ["categories"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch categories." } };
      }

      const body = await res.json();
      const items: ICategory[] = body?.items ?? body ?? [];
      return { data: items, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  // ─── Admin CRUD ───────────────────────────────────────────────────────────

  adminGetAllCategories: async (): Promise<{
    data: ICategory[] | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/admin/categories?pageSize=100&sortBy=createdAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { tags: ["categories"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch categories." } };
      }

      const body = await res.json();
      const items: ICategory[] = body?.items ?? body ?? [];
      return { data: items, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  adminCreateCategory: async (payload: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  }): Promise<{ data: ICategory | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Could not create category." },
        };
      }

      return { data: data as ICategory, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  adminUpdateCategory: async (
    id: string,
    payload: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
    }
  ): Promise<{ data: ICategory | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Could not update category." },
        };
      }

      return { data: data as ICategory, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  adminDeleteCategory: async (
    id: string
  ): Promise<{ data: ICategory | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Could not delete category." },
        };
      }

      return { data: data as ICategory, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
