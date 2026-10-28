import type { ErrorRequestHandler } from "express";
import { logger } from "../lib/logger.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  const errorMessage =
    error instanceof Error ? error.message : String(error);

  logger.error("Request processing failed", {
    method: req.method,
    path: req.originalUrl,
    error: errorMessage,
  });

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};