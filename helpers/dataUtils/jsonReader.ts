import * as fs from 'fs';
import * as path from 'path';

export class JsonReader {
    /**
     * Reads a JSON file dynamically and parses its content.
     * @param fileName - The name or relative path of the JSON file.
     * @param basePath - The base directory (default is `__dirname`).
     * @returns The parsed JSON object or null if an error occurs.
     */
    static readJson(fileName: string, basePath: string = __dirname): Record<string, any> | null {
        const filePath = path.join(basePath, fileName); // Construct the full file path
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read file as UTF-8 string
            return JSON.parse(fileContent); // Parse and return JSON object
        } catch (error) {
            console.error(`Error reading or parsing the file: ${fileName}`, error);
            return null;
        }
    }
}
    