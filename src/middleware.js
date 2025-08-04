import { NextResponse } from "next/server"

export function middleware(request) {
    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ["/dashboard", "/tutor"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    if (isProtectedRoute) {
        // In a real app, you'd verify the JWT token here
        const token = request.cookies.get("token")?.value

        if (!token) {
            return NextResponse.redirect(new URL("/auth", request.url))
        }
    }

    // Redirect root to auth page
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/auth", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
