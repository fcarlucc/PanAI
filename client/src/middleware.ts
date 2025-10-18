import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Per ora, middleware semplice che permette tutto
  // L'autenticazione sarà gestita lato client con wagmi
  // Le route /preview sono pubbliche, le altre richiedono wallet connesso
  return NextResponse.next();
}

export const config = {
  // Protegge tutte le route tranne quelle nella cartella preview e asset statici
  matcher: [
    /*
     * Match all request paths except:
     * - preview pages
     * - _next directory (Next.js static files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image files
     */
    '/((?!preview|_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)',
  ],
}
