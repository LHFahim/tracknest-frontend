import "server-only";

import { env } from "@/env";
import { IClaim, IClaimPaginated } from "@/types/claim.interface";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getBearerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export const claimService = {
  // ─── Regular user ─────────────────────────────────────────────────────────

  createClaim: async (payload: {
    foundItemId: string;
    message: string;
    images: string[];
    lostItemId?: string;
  }): Promise<{ data: IClaim | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/claims`, {
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
          error: { message: data?.message ?? "Could not submit claim." },
        };
      }

      return { data: data as IClaim, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getMyClaims: async (): Promise<{
    data: IClaimPaginated | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/claims/my?sortBy=createdAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          next: { tags: ["claims"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch claims." } };
      }

      const data = await res.json();
      return { data: data as IClaimPaginated, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  withdrawClaim: async (
    claimId: string
  ): Promise<{ data: IClaim | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/claims/my/${claimId}/withdraw`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Could not withdraw claim." },
        };
      }

      return { data: data as IClaim, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getMyClaimById: async (
    claimId: string
  ): Promise<{ data: IClaim | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();
      const res = await fetch(`${API_URL}/claims/my/${claimId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 404) return { data: null, error: { message: "Claim not found." } };
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: "Could not fetch claim." } };
      return { data: data as IClaim, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  // ─── Admin ────────────────────────────────────────────────────────────────

  adminGetAllClaims: async (): Promise<{
    data: IClaimPaginated | null;
    error: { message: string } | null;
  }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(
        `${API_URL}/admin/claims?sortBy=createdAt&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          next: { tags: ["claims"] },
        }
      );

      if (!res.ok) {
        return { data: null, error: { message: "Could not fetch claims." } };
      }

      const data = await res.json();
      return { data: data as IClaimPaginated, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  adminUpdateClaimStatus: async (
    claimId: string,
    payload: { status: string; reviewComment?: string }
  ): Promise<{ data: IClaim | null; error: { message: string } | null }> => {
    try {
      const token = await getBearerToken();

      const res = await fetch(`${API_URL}/admin/claims/${claimId}/status`, {
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
          error: { message: data?.message ?? "Could not update claim status." },
        };
      }

      return { data: data as IClaim, error: null };
    } catch {
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
