type LogContext = Record<string, unknown>;

function writeLog(
  level: "info" | "warn" | "error",
  message: string,
  context: LogContext = {},
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  console.log(JSON.stringify(entry));
}

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog("info", message, context);
  },

  warn(message: string, context?: LogContext): void {
    writeLog("warn", message, context);
  },

  error(message: string, context?: LogContext): void {
    writeLog("error", message, context);
  },
};