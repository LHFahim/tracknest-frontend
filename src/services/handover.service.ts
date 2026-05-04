import "server-only";

import { env } from "@/env";
import { IHandover, IHandoverPaginated } from "@/types/handover.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const handoverService = {
  // ─── Regular user ─────────────────────────────────────────────────────────

  getMyHandovers: async (): Promise<{
    data: IHandoverPaginated | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/handovers/my-handover?sortBy=handedOverAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          next: { tags: ["handovers"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch handovers." } };
      }

      const data = await res.json();
      return { data: data as IHandoverPaginated, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getHandoverById: async (
    handoverId: string
  ): Promise<{ data: IHandover | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();
      const res = await fetch(`${API_URL}/handovers/${handoverId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 404) return { data: null, error: { message: "Handover not found." } };
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: "Could not fetch handover." } };
      return { data: data as IHandover, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  // ─── Admin ────────────────────────────────────────────────────────────────

  adminGetAllHandovers: async (): Promise<{
    data: IHandoverPaginated | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/admin/handovers?sortBy=handedOverAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          next: { tags: ["handovers"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch handovers." } };
      }

      const data = await res.json();
      return { data: data as IHandoverPaginated, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  adminCreateHandover: async (payload: {
    foundItem: string;
    receivedByUser: string;
    note?: string;
  }): Promise<{ data: IHandover | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/admin/handovers`, {
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
          error: { message: data?.message ?? "Could not create handover." },
        };
      }

      return { data: data as IHandover, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
