import * as XLSX from 'xlsx';
import path from 'path';
import { FakerData } from '../helpers/testDataGen/fakerUtils';

// Define test data
const testData = [
    {
        TestCaseID: 'TC001',
        TestDescription: 'Create Lead with all valid data',
        Username: 'DemoSalesManager',
        Password: 'crmsfa',
        CompanyName: 'Tech Solutions Ltd',
        FirstName: 'John',
        LastName: 'Smith',
        Source: 'Cold Call',
        MarketingCampaign: 'Automobile',
        Industry: 'Computer Software',
        Ownership: 'S-Corporation',
        Phone: '1234567890',
        Email: 'john.smith@techsolutions.com',
        Country: 'United States',
        State: 'Texas',  // Updated to match available state options
        City: 'San Antonio',
        ExpectedResult: 'Success'
    },
    {
        TestCaseID: 'TC002',
        TestDescription: 'Create Lead with minimum required fields',
        Username: 'DemoSalesManager',
        Password: 'crmsfa',
        CompanyName: FakerData.getOrganizationName(),
        FirstName: FakerData.getFirstName(),
        LastName: FakerData.getLastName(),
        ExpectedResult: 'Success'
    },
    {
        TestCaseID: 'TC003',
        TestDescription: 'Create Lead with different source and campaign',
        Username: 'DemoSalesManager',
        Password: 'crmsfa',
        CompanyName: 'Global Tech Inc',
        FirstName: 'Sarah',
        LastName: 'Johnson',
        Source: 'Employee',
        MarketingCampaign: 'Pay Per Click Advertising',
        Industry: 'Computer Hardware',
        Phone: FakerData.getMobileNumber(),
        Email: FakerData.getEmail(),
        Country: 'India',
        State: 'KERALA',
        City: 'Kochi',
        ExpectedResult: 'Success'
    }
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheet
const worksheet = XLSX.utils.json_to_sheet(testData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'LeadData');

// Write to file
const filePath = path.join(__dirname, '../data/testData/LeafTapsData.xlsx');
XLSX.writeFile(workbook, filePath);

console.log('Excel file created successfully at:', filePath);