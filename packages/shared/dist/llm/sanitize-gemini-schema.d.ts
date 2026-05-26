/**
 * JSON Schema keywords rejected by Gemini generateContent response_schema
 * (gemini-2.5-flash-lite, gemini-2.0-flash, etc.).
 */
export declare const GEMINI_UNSUPPORTED_SCHEMA_KEYS: Set<string>;
/**
 * Recursively strips Gemini-incompatible JSON Schema keywords while preserving
 * type, properties, items, required, enum, and description (plus safe constraints
 * like minimum/maximum after exclusive* coercion).
 */
export declare function sanitizeGeminiSchema<T = Record<string, unknown>>(schema: unknown): T;
