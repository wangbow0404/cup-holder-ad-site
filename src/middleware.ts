import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin 전체 보호 (정적파일 포함)
  if (pathname.startsWith("/admin") && pathname !== "/partner/login") {
    const authed = req.cookies.get("withfom_admin")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/partner/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

