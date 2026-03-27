// import { RolesEnum } from "@/constants/role";
// import { userService } from "@/services/user.service";
// import { NextRequest, NextResponse } from "next/server";

// export const proxy = async (req: NextRequest) => {
//   const pathName = req.nextUrl.pathname;

//   let isAuthenticated = false;
//   let isAdmin = false;

//   const { data } = await userService.getSession();
//   if (data) {
//     isAuthenticated = true;
//     if (data.user.role === RolesEnum.ADMIN) {
//       isAdmin = true;
//     }
//   }

//   if (!isAuthenticated) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (isAdmin && pathName.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/admin-dashboard", req.url));
//   }

//   // if (!isAdmin && pathName.startsWith("/admin-dashboard")) {
//   //   return NextResponse.redirect(new URL("/dashboard", req.url));
//   // }

//   return NextResponse.next();
// };

// export const config = {
//   matcher: [
//     "/dashboard",
//     "/dashboard/:path*",
//     "/admin-dashboard",
//     "/admin-dashboard/:path*",
//   ],
// };
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const token = req.cookies.get("better-auth.session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin-dashboard/:path*"],
};
