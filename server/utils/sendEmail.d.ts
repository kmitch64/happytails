/**
 *
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<string | boolean>}
 */
export function sendEmail(email: string, subject: string, text: string, html: string): Promise<string | boolean>;
