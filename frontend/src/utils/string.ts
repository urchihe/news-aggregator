/**
 * Removes HTML tags from a string.
 * @param html - The HTML string to strip tags from.
 * @returns The plain text string without HTML tags.
 */
export const stripHtml = (html: string): string => {
    return html.replace(/<[^>]+>/g, '');
};

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param str - The string to escape.
 * @returns The escaped string safe for use in regular expressions.
 */
export const escapeRegex = (str: string): string => {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Splits a string by a case-insensitive delimiter.
 * @param str - The string to split.
 * @param delimiter - The delimiter to split by.
 * @returns An array of strings split by the delimiter.
 */
export const splitCaseInsensitive = (str: string, delimiter: string): string[] => {
    return str.split(new RegExp(escapeRegex(delimiter), 'ig'));
};
