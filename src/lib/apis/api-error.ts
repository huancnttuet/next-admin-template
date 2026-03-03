import axios from 'axios';

/**
 * Validation error shape returned by the .NET backend (FluentValidation).
 */
export interface ValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue?: unknown;
  severity?: number;
  errorCode?: string;
  formattedMessagePlaceholderValues?: Record<string, unknown>;
}

/**
 * Problem Details error envelope used by the backend.
 *
 * @see https://www.rfc-editor.org/rfc/rfc7807
 */
export interface ApiProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  validationErrors?: ValidationError[];
}

/**
 * Extract a structured `ApiProblemDetails` from an unknown error.
 *
 * Returns `null` when the error is not an Axios response with a
 * recognisable problem-details body.
 */
export function getApiProblemDetails(
  error: unknown,
): ApiProblemDetails | null {
  if (!axios.isAxiosError(error)) return null;

  const data = error.response?.data;
  if (!data || typeof data !== 'object') return null;

  // At a minimum the backend returns `status` or `title`
  if ('status' in data || 'title' in data) {
    return data as ApiProblemDetails;
  }

  return null;
}

/**
 * Extract validation errors from an API error.
 *
 * Returns an empty array when there are no validation errors.
 */
export function getValidationErrors(error: unknown): ValidationError[] {
  return getApiProblemDetails(error)?.validationErrors ?? [];
}

/**
 * Get a single, human-readable error message from an API error.
 *
 * Priority:
 *  1. First validation error message (most specific)
 *  2. `detail` from problem details
 *  3. `title` from problem details
 *  4. Axios message
 *  5. Generic fallback
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred.',
): string {
  const problem = getApiProblemDetails(error);

  if (problem) {
    // Prefer first validation error message — it's user-facing
    const firstValidation = problem.validationErrors?.[0]?.errorMessage;
    if (firstValidation) return firstValidation;

    if (problem.detail) return problem.detail;
    if (problem.title) return problem.title;
  }

  if (axios.isAxiosError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

/**
 * Convert validation errors to a `Record<field, message>` for
 * use with react-hook-form `setError`.
 *
 * Property names are lowercased to match typical camelCase form fields
 * (backend returns PascalCase property names).
 */
export function getFieldErrors(
  error: unknown,
): Record<string, string> {
  const validationErrors = getValidationErrors(error);
  const fieldErrors: Record<string, string> = {};

  for (const ve of validationErrors) {
    // Convert PascalCase → camelCase (Name → name)
    const field =
      ve.propertyName.charAt(0).toLowerCase() + ve.propertyName.slice(1);
    // Keep only the first error per field
    if (!fieldErrors[field]) {
      fieldErrors[field] = ve.errorMessage;
    }
  }

  return fieldErrors;
}
