// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5928e04352b75f933f220ce6f238c536@o4509671747223552.ingest.us.sentry.io/4509671748075522",
  enabled: process.env.NODE_ENV === 'production',

  integrations: [
    // Add the Vercel AI SDK integration to config.server.(js/ts)
    Sentry.vercelAIIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  sendDefaultPii: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
