import * as XLSX from 'xlsx';
import path from 'path';

export class ExcelDataProvider {
    private filePath: string;
    private workbook: XLSX.WorkBook;

    constructor(filePath: string) {
        this.filePath = path.resolve(filePath);
        this.workbook = XLSX.readFile(this.filePath);
    }

    /**
     * Gets all test data from a specific sheet
     * @param sheetName Name of the sheet to read from
     * @returns Array of objects containing test data
     */
    public getTestData(sheetName: string): any[] {
        if (!this.workbook.SheetNames.includes(sheetName)) {
            throw new Error(`Sheet "${sheetName}" not found in workbook`);
        }

        const worksheet = this.workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
    }

    /**
     * Gets test data for specific test cases
     * @param sheetName Name of the sheet to read from
     * @param testCaseIds Array of test case IDs to filter by
     * @returns Filtered array of test data
     */
    public getTestDataByIds(sheetName: string, testCaseIds: string[]): any[] {
        const allData = this.getTestData(sheetName);
        return allData.filter(row => testCaseIds.includes(row.TestCaseID));
    }

    /**
     * Gets test data by a specific criteria
     * @param sheetName Name of the sheet to read from
     * @param criteria Object containing key-value pairs to filter by
     * @returns Filtered array of test data
     */
    public getTestDataByCriteria(sheetName: string, criteria: Record<string, any>): any[] {
        const allData = this.getTestData(sheetName);
        return allData.filter(row => {
            return Object.entries(criteria).every(([key, value]) => row[key] === value);
        });
    }
}
