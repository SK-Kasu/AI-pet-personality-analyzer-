import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
const app = express();

// Disable the Express technology-identification header.
app.disable("x-powered-by");

// Add security-related HTTP headers.
app.use(helmet());

// Allow requests from the configured frontend origin.
app.use(cors({ origin: env.WEB_ORIGIN }));

// Parse incoming JSON request bodies.
app.use(express.json({ limit: "1mb" }));

// Health-check endpoint for verifying that the API is running.
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ai-pet-personality-analyzer-api",
    timestamp: new Date().toISOString(),
  });
});

// Return a consistent response for unknown routes.
app.use(notFoundHandler);

// Handle errors passed through Express middleware.
app.use(errorHandler);

logger.info("Express application configured");

// Export the application so server.ts can start it.
export { app };