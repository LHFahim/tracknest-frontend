import "server-only";

import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export const userService = {
  getSession: async () => {
    try {
      // const headerList = headers();
      // const cookieHeader = (await headerList).get("cookie") || "";

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          cookie: cookieStore.toString(),
          // cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      });

      const session = await res.json();

      if (session === null) {
        return {
          data: null,
          error: { message: "No active session" },
        };
      }

      return {
        data: session,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch session" },
      };
    }
  },

  getAllUsers: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
        next: { tags: ["users"] },
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not fetch users." },
        };
      }

      return { data: data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "BANNED" }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Could not ban user." },
        };
      }

      return { data: data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateMyProfile: async (payload: {
    name?: string;
    image?: string | null;
    phone?: string | null;
  }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/me`, {
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
          error: { message: "Error: Could not update profile." },
        };
      }

      return { data: data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
