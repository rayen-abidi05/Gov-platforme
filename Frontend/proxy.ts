import {NextRequest,NextResponse} from "next/server"


export function proxy (request :  NextRequest) {
    const refresh_token = request.cookies.get("refresh_token")
    const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ;
    if (!refresh_token && isProtected) {
        return NextResponse.redirect(new URL ("/login", request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/ryn/:path*"],
}