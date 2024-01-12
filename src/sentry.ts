import * as Sentry from "@sentry/react";

const dsnKey = import.meta.env.VITE_SENTRY_KEY ?? "";
Sentry.init({
  dsn: dsnKey,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.PROD && dsnKey,
});
