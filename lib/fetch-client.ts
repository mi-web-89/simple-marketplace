import { ApiError } from "./api-error";
import { logger } from "./logger";

interface FetchClientOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  module?: string;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_TIMEOUT = 15_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 500;

export async function fetchClient<T = unknown>(
  url: string,
  options: FetchClientOptions = {},
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    module = "fetch-client",
    ...fetchOptions
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const signal = fetchOptions.signal
        ? combineSignals(fetchOptions.signal, controller.signal)
        : controller.signal;

      const res = await fetch(url, { ...fetchOptions, signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status >= 500 && attempt < retries) {
          logger.warn(
            module,
            `Retry ${attempt + 1}/${retries} — ${res.status} on ${url}`,
          );
          await delay(retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw mapHttpError(res.status, body.error ?? res.statusText, body);
      }

      // Handle 204 No Content
      if (res.status === 204) return undefined as T;

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;

      if (err instanceof DOMException && err.name === "AbortError") {
        if (attempt < retries) {
          logger.warn(
            module,
            `Timeout retry ${attempt + 1}/${retries} — ${url}`,
          );
          await delay(retryDelay * Math.pow(2, attempt));
          continue;
        }
        throw ApiError.badRequest("Request timed out");
      }

      if (!(err instanceof ApiError)) {
        if (attempt < retries) {
          logger.warn(
            module,
            `Network error retry ${attempt + 1}/${retries} — ${url}`,
          );
          await delay(retryDelay * Math.pow(2, attempt));
          continue;
        }
      }

      throw err;
    }
  }

  throw lastError;
}

function mapHttpError(
  status: number,
  message: string,
  body?: unknown,
): ApiError {
  switch (status) {
    case 400:
      return ApiError.badRequest(message, body);
    case 401:
      return ApiError.unauthorized(message);
    case 403:
      return new ApiError("FORBIDDEN", message);
    case 404:
      return ApiError.notFound(message);
    case 422:
      return ApiError.validation(message, body);
    case 429:
      return new ApiError("RATE_LIMITED", message);
    case 502:
    case 503:
    case 504:
      return ApiError.upstream(message, body);
    default:
      return status >= 500
        ? ApiError.internal(message)
        : ApiError.badRequest(message, body);
  }
}

function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}
