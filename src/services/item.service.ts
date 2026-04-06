import "server-only";

import { env } from "@/env";
import { IItem } from "@/types/item.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const itemService = {
  getAllItems: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/items`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        next: { tags: ["items"] },
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not fetch items." },
        };
      }

      return { data: data as IItem[], error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getItemById: async (id: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        next: { tags: ["items"] },
        credentials: "include",
      });

      if (res.status === 404) {
        return { data: null, error: { message: "Item not found." } };
      }

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not fetch item." },
        };
      }

      return { data: data as IItem, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  createItem: async (
    payload: Omit<IItem, "id" | "reportedBy" | "createdAt" | "updatedAt">
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not create item." },
        };
      }

      return { data: data as IItem, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateItem: async (
    id: string,
    payload: Partial<Omit<IItem, "id" | "reportedBy" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "PATCH",
        headers: {
          cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not update item." },
        };
      }

      return { data: data as IItem, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteItem: async (id: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/items/${id}`, {
        method: "DELETE",
        headers: {
          cookie: cookieStore.toString(),
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not delete item." },
        };
      }

      return { data: data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
