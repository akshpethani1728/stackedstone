import type { z } from "zod";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "STORAGE_ERROR"
  | "DATABASE_ERROR"
  | "RATE_LIMITED"
  | "PAYMENT_REQUIRED";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCodeFor(code);
    this.details = details;
  }
}

function statusCodeFor(code: ErrorCode): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "PAYMENT_REQUIRED":
      return 402;
    case "STORAGE_ERROR":
    case "DATABASE_ERROR":
    case "INTERNAL_ERROR":
      return 500;
  }
}

export class ValidationError extends AppError {
  public readonly zodError?: z.ZodError;

  constructor(message: string, zodError?: z.ZodError) {
    super("VALIDATION_ERROR", message, zodError?.errors);
    this.name = "ValidationError";
    this.zodError = zodError;
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    const msg = id ? `${entity} with id "${id}" not found` : `${entity} not found`;
    super("NOT_FOUND", msg);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super("UNAUTHORIZED", message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super("FORBIDDEN", message);
    this.name = "ForbiddenError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown) {
    super("DATABASE_ERROR", message, cause);
    this.name = "DatabaseError";
  }
}

export class StorageError extends AppError {
  constructor(message: string, cause?: unknown) {
    super("STORAGE_ERROR", message, cause);
    this.name = "StorageError";
  }
}

export function fromSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const message = error instanceof Error ? error.message : "An unexpected error occurred";

  if (message.includes("violates foreign key")) {
    return new AppError("CONFLICT", "Referenced record not found", message);
  }
  if (message.includes("duplicate key")) {
    return new AppError("CONFLICT", "A record with this identifier already exists", message);
  }
  if (message.includes("violates row-level security") || message.includes("permission denied")) {
    return new ForbiddenError("Insufficient permissions to access this resource");
  }
  if (message.includes("JWT") || message.includes("token")) {
    return new UnauthorizedError("Invalid or expired authentication token");
  }
  if (message.includes("syntax error") || message.includes("invalid input")) {
    return new ValidationError("Invalid data format", undefined);
  }

  return new DatabaseError(message, error);
}

export function formatError(error: unknown): { code: ErrorCode; message: string; statusCode: number; details?: unknown } {
  const appError = error instanceof AppError ? error : fromSupabaseError(error);
  return {
    code: appError.code,
    message: appError.message,
    statusCode: appError.statusCode,
    details: appError.details,
  };
}
