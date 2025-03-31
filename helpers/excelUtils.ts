// utils/excelReader.ts
import * as XLSX from 'xlsx';

export class ExcelReader {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath; // Store the file path of the Excel file
    }

    // Method to read the entire sheet into an array of objects
    public readExcel(sheetIndexOrName: number | string = 0): any[] | null {
        try {
            // Read the Excel file into a workbook
            const workbook = XLSX.readFile(this.filePath);

            let sheetName: string;
            
            // Determine the sheet name based on the provided index or name
            if (typeof sheetIndexOrName === 'number') {
                // If a number is provided, treat it as a sheet index
                if (sheetIndexOrName >= workbook.SheetNames.length) {
                    console.error(`Sheet index ${sheetIndexOrName} out of range. Max index: ${workbook.SheetNames.length - 1}`);
                    return null; // Return null if index is out of range
                }
                sheetName = workbook.SheetNames[sheetIndexOrName]; // Get sheet name from index
            } else if (typeof sheetIndexOrName === 'string') {
                // If a string is provided, treat it as a sheet name
                if (!workbook.SheetNames.includes(sheetIndexOrName)) {
                    console.error(`Sheet name "${sheetIndexOrName}" not found in the workbook.`);
                    return null; // Return null if sheet name does not exist
                }
                sheetName = sheetIndexOrName; // Use the provided sheet name
            } else {
                console.error('Invalid sheet index or name');
                return null;
            }

            // Get the worksheet object
            const worksheet = workbook.Sheets[sheetName];
            // Convert the worksheet data into an array of arrays
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (data.length === 0) {
                return []; // Return an empty array if there is no data
            }

            // Extract headers from the first row and normalize them (convert to lowercase, trim spaces)
            const headers = (data[0] as string[]).map(header => header.trim().toLowerCase()); 
            // Extract the rest of the rows
            const rows = data.slice(1) as any[];

            // Convert rows into an array of objects using headers as keys
            return rows.map((row: any[]) => {
                const rowObject: any = {};
                headers.forEach((header: string, index: number) => {
                    rowObject[header] = row[index]; // Map each cell to the corresponding header
                });
                return rowObject; // Return row as an object
            });
        } catch (error) {
            console.error('Error reading the Excel file:', error);
            return null; // Return null in case of an error
        }
    }

    // Method to find a row based on a specific column value
    public getRowByTestcase(sheetIndexOrName: number | string, property: string, testcase: string,): any | null {
        // Read the sheet data
        const data = this.readExcel(sheetIndexOrName);
        if (data) {
            // Find and return the first row where the given property matches the testcase value
            return data.find(row => row[property] === testcase) || null;
        }
        return null; // Return null if data is not found
    }
}


// Example usage (uncomment to test):
/* const reader = new ExcelReader('../data/OneData.xlsx');
const testCaseID = "TC004";
const rowData = reader.getRowByTestcase('admin',RowName ,testCaseID); 

if (rowData) {
    const login = rowData?.login; 
    console.log('Login:', login); 
} else {
    console.error(`No data found for testcase "${testCaseID}"`);
} */