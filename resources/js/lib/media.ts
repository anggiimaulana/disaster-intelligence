/**
 * Shared media helpers.
 *
 * `isMediaIcon` and `isMediaUrl` are used across the CMS to detect whether
 * a string value (icon name, thumbnail path, avatar path) is a media-library
 * URL vs a built-in Lucide icon name vs raw input filename. Keeping the
 * detection in one place prevents drift between forms.
 */

export function isMediaIcon(value: string | null | undefined): boolean {
    if (!value) return false;
    return (
        /^https?:\/\//.test(value) ||
        value.startsWith('/storage/') ||
        value.startsWith('media/')
    );
}

export function isMediaUrl(value: string | null | undefined): boolean {
    return isMediaIcon(value);
}

/**
 * Safe parser for settings values. Setting's getValueAttribute auto-decodes
 * JSON to arrays/objects, so values may arrive as either a JSON string or
 * a native value. parseSetting handles both shapes without throwing.
 */
export function parseSetting<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value) || typeof value === 'object') return value as T;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return (parsed ?? fallback) as T;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

export function safeArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[];
    return [];
}
