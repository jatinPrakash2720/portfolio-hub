import { type NextRequest, NextResponse } from "next/server"

export function domainCheck(request: NextRequest) {
  return NextResponse.next()
}
