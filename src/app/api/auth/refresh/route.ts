import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const backendRes = await fetch(`${env.API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Token refresh failed" },
        { status: backendRes.status }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    const maxAge = 7 * 24 * 60 * 60;

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true, path: "/", maxAge, sameSite: "lax",
    });
    response.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true, path: "/", maxAge: 30 * 24 * 60 * 60, sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
