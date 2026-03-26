import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://96dd6178dd28b4a2e87fc5e95986f080@o4511112615034880.ingest.us.sentry.io/4511112623030272",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});