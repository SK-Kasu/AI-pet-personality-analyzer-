import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

// Start the HTTP server on the configured port.
const server = app.listen(env.PORT, () => {
  logger.info("API server started", {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
});

// Gracefully shut down the server when requested.
function shutdown(signal: string): void {
  logger.info("Shutdown signal received", { signal });

  server.close((error?: Error) => {
    if (error) {
      logger.error("Error while closing server", {
        error: error.message,
      });

      process.exitCode = 1;
      return;
    }

    logger.info("API server closed successfully");
  });
}

// Handle Ctrl+C and termination signals.
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));