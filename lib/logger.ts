type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const LOG_PREFIXES: Record<LogLevel, string> = {
  debug: "🔍",
  info: "ℹ️",
  warn: "⚠️",
  error: "🚨",
};

function log(level: LogLevel, module: string, message: string, meta?: LogMeta) {
  const prefix = LOG_PREFIXES[level];
  const timestamp = new Date().toISOString();
  const parts = [`${prefix} [${timestamp}] [${module}] ${message}`];

  if (meta && Object.keys(meta).length > 0) {
    parts.push(JSON.stringify(meta));
  }

  switch (level) {
    case "error":
      console.error(...parts);
      break;
    case "warn":
      console.warn(...parts);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") console.debug(...parts);
      break;
    default:
      console.log(...parts);
  }
}

export const logger = {
  debug: (module: string, message: string, meta?: LogMeta) =>
    log("debug", module, message, meta),
  info: (module: string, message: string, meta?: LogMeta) =>
    log("info", module, message, meta),
  warn: (module: string, message: string, meta?: LogMeta) =>
    log("warn", module, message, meta),
  error: (module: string, message: string, meta?: LogMeta) =>
    log("error", module, message, meta),
};
