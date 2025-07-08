import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.toLowerCase()
  if (
    path === '/' ||
    path === '/sybau' ||
    path === '/api/save_script'
  ) {
    return NextResponse.next()
  }
  return new Response('kys', {
    status: 403,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
