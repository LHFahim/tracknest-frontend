import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${env.API_URL}/auth/register/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Registration failed" },
        { status: backendRes.status }
      );
    }

    const response = NextResponse.json({ user: data.user }, { status: 200 });

    const maxAge = 7 * 24 * 60 * 60; // 7 days

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      path: "/",
      maxAge,
      sameSite: "lax",
    });

    // Store panelType so userService.getSession() can read the role.
    // /profile/me only returns firstName/lastName/email/phone (ProfileDto omits panelType).
    response.cookies.set("panel_type", data.user?.panelType ?? "", {
      httpOnly: true,
      path: "/",
      maxAge,
      sameSite: "lax",
    });

    // Store user_id so we can call PATCH /users/:id for profile updates.
    // /profile/me (ProfileDto) omits the id field.
    response.cookies.set("user_id", data.user?.id ?? "", {
      httpOnly: true,
      path: "/",
      maxAge,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
