import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieName = "@Verzel:authToken";

  const cookies = req.cookies.get(cookieName);
  const currentUrl = req.url;

  if (
    (currentUrl.includes("/users") || currentUrl.includes("/cars")) &&
    !cookies
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
