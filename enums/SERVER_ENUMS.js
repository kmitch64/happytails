/**
 * Enumerations and constants for the server.
 */

import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
const __dirname = resolve();


/**
 * Function that returns the path to the main index HTML file.
 * @returns {string} The absolute path to index.html
 */
const INDEX_HTML = () => join(__dirname, 'frontend', 'dist', 'index.html');

/**
 * Asynchronous function that reads the index HTML file and returns its contents as a string.
 * @returns {Promise<string>} A promise that resolves to the contents of index.html as a string
 */
const INDEX_AS_STRING = async () => await readFile(INDEX_HTML(), 'utf8');

/**
 * Function that returns the path to the static assets directory.
 * @returns {string} The absolute path to the static assets
 */
const STATIC_ASSETS = () => join(__dirname, 'frontend', 'dist');
// console.log('Static assets path:', STATIC_ASSETS());

const SYSTEM_PROMPT = {
  role: 'system',
  content: "You are a helpful pet care assistant for HappyTails." +
    "Provide concise, accurate advice about pet care, health, and training." +
    "Always prioritize pet safety and well-being." +
    "If you're unsure about medical advice, suggest consulting a veterinarian."
};

export { INDEX_HTML, INDEX_AS_STRING, STATIC_ASSETS, SYSTEM_PROMPT };