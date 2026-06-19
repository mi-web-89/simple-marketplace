import { NextResponse } from "next/server";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "UPSTREAM_ERROR"
  | "TIMEOUT";

const STATUS_MAP: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  UPSTREAM_ERROR: 502,
  TIMEOUT: 504,
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = STATUS_MAP[code] ?? 500;
    this.details = details;
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError("BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError("UNAUTHORIZED", message);
  }

  static notFound(message = "Not found") {
    return new ApiError("NOT_FOUND", message);
  }

  static validation(message: string, details?: unknown) {
    return new ApiError("VALIDATION_ERROR", message, details);
  }

  static upstream(message = "Upstream service error", details?: unknown) {
    return new ApiError("UPSTREAM_ERROR", message, details);
  }

  static internal(message = "Internal server error") {
    return new ApiError("INTERNAL_ERROR", message);
  }
}

export function toNextResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    const body: Record<string, unknown> = { error: error.message, code: error.code };
    if (error.details) body.details = error.details;
    return NextResponse.json(body, { status: error.status });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid JSON payload", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  console.error("[UNHANDLED]", error);
  return NextResponse.json(
    { error: "Internal server error", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

export function withErrorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => Promise<NextResponse>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any[]) => Promise<NextResponse> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      return toNextResponse(error);
    }
  };
}
