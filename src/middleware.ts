import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/waitlist', 'api/gpt'])
const isApiToolsRoute = createRouteMatcher(['/api(.*)', '/tools(.*)'])


export default clerkMiddleware(async (auth, request) => {
  const authorization = request.headers.get('Authorization');
  if (authorization)
    console.log(authorization);
  
  // Check if this is an API or tools route
  if (!isPublicRoute(request)) {
    try {
      await auth.protect()
    } catch (error) {
      // Return 401 for API and tools routes
      if (isApiToolsRoute(request)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      // For other routes, let Clerk handle the redirect
      throw error
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
