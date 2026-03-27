import { env } from "@/env";

const AUTH_URL = env.NEXT_PUBLIC_AUTH_URL;

export const userClientService = {
  getSession: async () => {
    try {
      const res = await fetch(`${AUTH_URL}/get-session`, {
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
};
