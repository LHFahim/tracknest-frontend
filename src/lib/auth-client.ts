import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

const next_be_url = env.NEXT_PUBLIC_BACKEND_URL;
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: next_be_url,
  fetchOptions: {
    credentials: "include",
  },
});
