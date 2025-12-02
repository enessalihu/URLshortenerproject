import { NextResponse } from "next/server"
import { getUrlByShortCode } from "@/app/actions"

export async function GET(request: Request, { params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params

  const result = await getUrlByShortCode(shortCode)

  if (result.error || !result.data) {
    // Redirect to home page with error
    return NextResponse.redirect(new URL("/?error=not-found", request.url))
  }

  // Redirect to the original URL
  return NextResponse.redirect(result.data.original_url)
}
