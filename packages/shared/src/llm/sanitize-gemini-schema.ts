/**
 * JSON Schema keywords rejected by Gemini generateContent response_schema
 * (gemini-2.5-flash-lite, gemini-2.0-flash, etc.).
 */
export const GEMINI_UNSUPPORTED_SCHEMA_KEYS = new Set([
  'exclusiveMinimum',
  'exclusiveMaximum',
  'patternProperties',
  'oneOf',
  'anyOf',
  'allOf',
  'not',
  'nullable',
  '$ref',
  '$schema',
  '$defs',
  'definitions',
  'additionalProperties',
  'const',
  'if',
  'then',
  'else',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function coerceExclusiveMinimum(value: number): number {
  if (value === 0) return 1;
  return Number.isInteger(value) ? value + 1 : value;
}

function coerceExclusiveMaximum(value: number): number {
  return Number.isInteger(value) ? value - 1 : value;
}

/**
 * Recursively strips Gemini-incompatible JSON Schema keywords while preserving
 * type, properties, items, required, enum, and description (plus safe constraints
 * like minimum/maximum after exclusive* coercion).
 */
export function sanitizeGeminiSchema<T = Record<string, unknown>>(schema: unknown): T {
  if (schema === null || schema === undefined) {
    return schema as T;
  }

  if (Array.isArray(schema)) {
    return schema.map((entry) => sanitizeGeminiSchema(entry)) as T;
  }

  if (!isPlainObject(schema)) {
    return schema as T;
  }

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (GEMINI_UNSUPPORTED_SCHEMA_KEYS.has(key)) {
      if (key === 'exclusiveMinimum' && typeof value === 'number') {
        const min = coerceExclusiveMinimum(value);
        const existing = output.minimum;
        output.minimum =
          typeof existing === 'number' ? Math.max(existing, min) : min;
      }
      if (key === 'exclusiveMaximum' && typeof value === 'number') {
        const max = coerceExclusiveMaximum(value);
        const existing = output.maximum;
        output.maximum =
          typeof existing === 'number' ? Math.min(existing, max) : max;
      }
      continue;
    }

    if (key === 'properties' && isPlainObject(value)) {
      const props: Record<string, unknown> = {};
      for (const [propKey, propVal] of Object.entries(value)) {
        props[propKey] = sanitizeGeminiSchema(propVal);
      }
      output.properties = props;
      continue;
    }

    if (key === 'items') {
      output.items = Array.isArray(value)
        ? value.map((item) => sanitizeGeminiSchema(item))
        : sanitizeGeminiSchema(value);
      continue;
    }

    if (Array.isArray(value)) {
      output[key] = value.map((item) =>
        isPlainObject(item) || Array.isArray(item) ? sanitizeGeminiSchema(item) : item,
      );
      continue;
    }

    if (isPlainObject(value)) {
      output[key] = sanitizeGeminiSchema(value);
      continue;
    }

    output[key] = value;
  }

  return output as T;
}
