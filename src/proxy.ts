import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/*
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/waitlist',
  '/sitemap.xml',
  'api/gpt',
  '/api/auth/check',
  '/tools(.*)',
  '/legal(.*)',
  '/connect(.*)',
  '/.well-known(.*)'])
*/

const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/playground(.*)',
  '/waitlist(.*)',
  '/api/auth(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(request)) {
    return redirectToSignIn()
  }
}/*, {debug: true}*/)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
