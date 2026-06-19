import { ApiError } from "./api-error";

type Rule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
};

type Rules = Record<string, Rule>;

type ValidationResult = Record<string, string[]>;

export function validate(body: Record<string, unknown>, rules: Rules): ValidationResult {
  const errors: ValidationResult = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = body[field];
    const fieldErrors: string[] = [];

    if (rule.required && (value === undefined || value === null || value === "")) {
      fieldErrors.push(rule.message ?? `${field} wajib diisi`);
      errors[field] = fieldErrors;
      continue;
    }

    if (value === undefined || value === null) continue;

    if (typeof value === "string") {
      if (rule.min !== undefined && value.length < rule.min) {
        fieldErrors.push(rule.message ?? `${field} minimal ${rule.min} karakter`);
      }
      if (rule.max !== undefined && value.length > rule.max) {
        fieldErrors.push(rule.message ?? `${field} maksimal ${rule.max} karakter`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message ?? `${field} format tidak valid`);
      }
    }

    if (typeof value === "number") {
      if (rule.min !== undefined && value < rule.min) {
        fieldErrors.push(rule.message ?? `${field} minimal ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        fieldErrors.push(rule.message ?? `${field} maksimal ${rule.max}`);
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return errors;
}

export function validateOrThrow(body: Record<string, unknown>, rules: Rules): void {
  const errors = validate(body, rules);
  const flatErrors = Object.entries(errors).flatMap(([field, msgs]) =>
    msgs.map((m) => `${field}: ${m}`),
  );
  if (flatErrors.length > 0) {
    throw ApiError.validation("Validation failed", { fields: errors });
  }
}
