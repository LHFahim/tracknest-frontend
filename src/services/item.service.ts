import "server-only";

import { env } from "@/env";
import {
  CustodyType,
  IFoundItem,
  ILostItem,
  IPaginatedResponse,
  LostItemStatus,
  FoundItemStatus,
} from "@/types/item.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const itemService = {
  // ─── Lost Items ─────────────────────────────────────────────────────────────

  getAllLostItems: async () => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/lost-items`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["items"] },
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not fetch lost items." } };
      }

      return { data: data as IPaginatedResponse<ILostItem>, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getLostItemById: async (id: string) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/lost-items/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["items"] },
      });

      if (res.status === 404) {
        return { data: null, error: { message: "Item not found." } };
      }

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not fetch lost item." } };
      }

      return { data: data as ILostItem, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateLostItemStatus: async (id: string, status: LostItemStatus) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/lost-items/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not update lost item status." } };
      }

      return { data: data as ILostItem, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteLostItem: async (id: string) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/lost-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not delete lost item." } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  // ─── Found Items ─────────────────────────────────────────────────────────────

  getAllFoundItems: async () => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/found-items`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["items"] },
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not fetch found items." } };
      }

      return { data: data as IPaginatedResponse<IFoundItem>, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getFoundItemById: async (id: string) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/found-items/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { tags: ["items"] },
      });

      if (res.status === 404) {
        return { data: null, error: { message: "Item not found." } };
      }

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not fetch found item." } };
      }

      return { data: data as IFoundItem, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateFoundItemStatus: async (id: string, status: FoundItemStatus) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/found-items/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not update found item status." } };
      }

      return { data: data as IFoundItem, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteFoundItem: async (id: string) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/found-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not delete found item." } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  // ─── Create items ────────────────────────────────────────────────────────────

  createLostItem: async (payload: {
    title: string;
    description: string;
    category: string;
    dateLost: string;
    locationLost?: string;
    brand?: string;
    color?: string;
    imageURL?: string;
  }): Promise<{ data: ILostItem | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/lost-items`, {
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
          error: { message: data?.message ?? "Could not create lost item." },
        };
      }

      return { data: data as ILostItem, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  createFoundItem: async (payload: {
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
  }): Promise<{ data: IFoundItem | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/found-items`, {
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
          error: { message: data?.message ?? "Could not create found item." },
        };
      }

      return { data: data as IFoundItem, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  // ─── Unified lookup by ID (tries lost first, then found) ────────────────────

  getItemById: async (id: string) => {
    const lostRes = await itemService.getLostItemById(id);
    if (lostRes.data) {
      return { data: lostRes.data as ILostItem | IFoundItem, kind: "lost" as const, error: null };
    }

    const foundRes = await itemService.getFoundItemById(id);
    if (foundRes.data) {
      return { data: foundRes.data as ILostItem | IFoundItem, kind: "found" as const, error: null };
    }

    return { data: null, kind: null, error: { message: "Item not found." } };
  },
};
