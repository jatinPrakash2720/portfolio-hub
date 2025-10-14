import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""

  // Extract subdomain from host
  // Examples:
  // - jatin.portfolio.jatinbuilds.com -> jatin
  // - himanshu.portfolio.jatinbuilds.com -> himanshu
  // - portfolio.jatinbuilds.com -> null (no subdomain)
  const subdomain = extractSubdomain(host)

  // Add the extracted username to the request headers for use in components
  const requestHeaders = new Headers(request.headers)
  if (subdomain) {
    requestHeaders.set("x-username", subdomain)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostWithoutPort = host.split(":")[0]

  // Split by dots
  const parts = hostWithoutPort.split(".")

  // For localhost development, check if it's subdomain.localhost
  if (hostWithoutPort.includes("localhost")) {
    if (parts.length >= 2 && parts[0] !== "localhost") {
      return parts[0]
    }
    return null
  }

  // For production domains like portfolio.jatinbuilds.com
  // We expect: subdomain.portfolio.jatinbuilds.com
  if (parts.length >= 3) {
    // Check if the second part is 'portfolio' (our main domain)
    if (parts[1] === "portfolio") {
      return parts[0]
    }
  }

  // For direct portfolio.jatinbuilds.com access, return null
  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
