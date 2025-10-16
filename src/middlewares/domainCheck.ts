import { type NextRequest, NextResponse } from "next/server"

export function domainCheck(_request: NextRequest) {
  return NextResponse.next()
}
