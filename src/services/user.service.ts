import "server-only";

import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const userService = {
  getSession: async () => {
    try {
      const token = await getBearerToken();

      if (!token) {
        return { data: null, error: { message: "No active session" } };
      }

      const res = await fetch(`${API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null, error: { message: "No active session" } };
      }

      const user = await res.json();

      // Backend returns `panelType`; map it to `role` for frontend consumption
      return { data: { user: { ...user, role: user.panelType } }, error: null };
    } catch {
      return { data: null, error: { message: "Failed to fetch session" } };
    }
  },

  getAllUsers: async () => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        next: { tags: ["users"] },
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not fetch users." } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "BANNED" }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not ban user." } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateMyProfile: async (payload: {
    name?: string;
    image?: string | null;
    phone?: string | null;
  }) => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/profile/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: { message: "Error: Could not update profile." } };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
