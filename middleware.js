import { NextResponse } from "next/server";

import { verifyToken } from "./utils/helper";

export async function middleware(req, ev) {
  //if token is valid
  const token = req ? req.cookies.get("token") : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  //if no token
  if ((!token || !userId) && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
  //redirect to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
  

