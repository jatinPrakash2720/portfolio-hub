import { type NextRequest, NextResponse } from "next/server"

export function domainCheck(request: NextRequest) {
  const url = request.nextUrl
  const host = request.headers.get("host")

  console.log("Host:", host)
  console.log("URL:", url.toString())

  return NextResponse.next()
}
