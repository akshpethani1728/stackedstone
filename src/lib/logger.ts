type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getConfigLevel(): LogLevel {
  if (typeof window !== "undefined") {
    const stored = window.sessionStorage.getItem("log_level") as LogLevel | null;
    if (stored && stored in LOG_LEVELS) return stored;
  }
  if (import.meta.env.DEV) return "debug";
  return "info";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getConfigLevel()];
}

function timestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, context: string, message: string, data?: unknown): string {
  const prefix = `[${timestamp()}] [${level.toUpperCase()}] [${context}]`;
  if (data !== undefined) {
    return `${prefix} ${message} ${JSON.stringify(data, null, 0)}`;
  }
  return `${prefix} ${message}`;
}

export const logger = {
  debug(context: string, message: string, data?: unknown) {
    if (!shouldLog("debug")) return;
    if (import.meta.env.DEV) {
      console.debug(formatMessage("debug", context, message, data));
    }
  },

  info(context: string, message: string, data?: unknown) {
    if (!shouldLog("info")) return;
    if (import.meta.env.DEV || import.meta.env.PROD) {
      console.info(formatMessage("info", context, message, data));
    }
  },

  warn(context: string, message: string, data?: unknown) {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", context, message, data));
  },

  error(context: string, message: string, data?: unknown) {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", context, message, data));
    if (data instanceof Error && data.stack) {
      console.error(`[${timestamp()}] [STACK] [${context}] ${data.stack}`);
    }
  },
};
