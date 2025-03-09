import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/waitlist', '/sitemap.xml', 'api/gpt', '/api/auth/check', '/api(.*)', '/tools(.*)','/legal(.*)', '/connect(.*)', '/.well-known(.*)'])
const isApiToolsRoute = createRouteMatcher(['/api(.*)', '/tools(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request) || isApiToolsRoute(request))
    return;
  
  await auth.protect();
}/*, {debug: true}*/)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
