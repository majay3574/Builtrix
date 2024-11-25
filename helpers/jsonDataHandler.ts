import fs from 'fs';
import path from 'path';

/**
 * Updates a JSON file by merging new data with the existing content of the file.
 * If the file does not exist, is empty, or contains malformed JSON, it creates a default structure and updates.
 * 
 * @param filePath - The relative path to the JSON file to be updated.
 * @param newData - The new data to merge with the existing JSON data.
 * @returns void
 */
export function updateJSONFile<T>(filePath: string, newData: T): void {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`File ${filePath} does not exist. Creating a new file.`);

    const initialData: T = {} as T;
    const jsonData: string = JSON.stringify(initialData, null, 2);
    fs.writeFileSync(fullPath, jsonData, 'utf8');
    console.log(`${filePath} has been created with an initial structure.`);
  }

  let existingData: T = {} as T;

  try {
    const data = fs.readFileSync(fullPath, 'utf8');
    if (!data.trim()) {
      console.log(`The file ${filePath} is empty. Initializing with default structure.`);

      existingData = {} as T;
      const jsonData: string = JSON.stringify(existingData, null, 2);
      fs.writeFileSync(fullPath, jsonData, 'utf8');
      console.log(`${filePath} has been initialized with a default structure.`);
    } else {

      existingData = JSON.parse(data);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`Malformed JSON in ${filePath}:`, err.message);
    } else {
      console.error(`Error reading file ${filePath}:`, err);
    }
    return;
  }
  const updatedData: T = {
    ...existingData,
    ...newData
  };

  const jsonData: string = JSON.stringify(updatedData, null, 2);

  fs.writeFileSync(fullPath, jsonData, 'utf8');
  console.log(`${filePath} has been successfully updated.`);
}

/* use:
export interface newData {
  tc071a?: string;
}
// Update the newData.json file
updateJSONFile<newData>('../data/newData.json', { tc071a: 'new value' });
/*

/**
 * Reads a JSON file from the provided file path and returns a random item from the array in the file.
 * 
 * @param filePath - The relative path to the JSON file (from the current directory).
 * @returns A random string from the JSON array in the file, or null if the file is empty or an error occurs.
 * 
 * The function reads the content of a JSON file, which should be an array of strings. 
 * It picks a random index from the array and returns the corresponding string.
 * If the file cannot be read or the JSON is invalid, it catches the error and returns `null`.
 * If the array in the file is empty, it will also return `null`.
 */
export function getRandomItemFromFile(filePath: string): string {
  const dataFilePath = path.join(__dirname, filePath);
  const data: string[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}


export function saveDataToJsonFile(filename: string, data: any): void {
  const jsonContent = JSON.stringify({ title: data }, null, 2);
  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing JSON to file:', err);
    } else {
      console.log(`JSON file has been saved to ${filePath}`);
    }
  });
}
