import { test, expect } from '@playwright/test';
import { ExcelDataProvider } from '../helpers/dataUtils/excelDD';
import path from 'path';
import { FakerData } from '../helpers/testDataGen/fakerUtils';

// Create instance of ExcelDataProvider
const excelProvider = new ExcelDataProvider(path.join(__dirname, '../data/testData/LeafTapsData.xlsx'));

test.describe('Data Driven Tests - LeafTaps Application', () => {
    const testData = excelProvider.getTestData('LeadData');

    for (const data of testData) {
        test(`Create Lead - ${data.TestCaseID}: ${data.TestDescription}`, async ({ page }) => {
            test.setTimeout(120000); // Increase timeout to 2 minutes
            // Add test annotations for better reporting
            test.info().annotations.push(
                { type: 'TestCase', description: data.TestCaseID },
                { type: 'Description', description: data.TestDescription },
                { type: 'Author', description: 'Ajay Michael' }
            );

            // Generate dynamic test data where needed
            const companyName = data.CompanyName || FakerData.getOrganizationName();
            const firstName = data.FirstName || FakerData.getFirstName();
            const lastName = data.LastName || FakerData.getLastName();

            await test.step('Login to LeafTaps', async () => {
                // Navigate to the login page
                await page.goto('http://leaftaps.com/opentaps/control/login');
                
                // Wait for the form to be ready
                await page.waitForSelector('#username', { state: 'visible' });
                
                // Fill in login details
                await page.fill('#username', data.Username);
                await page.fill('#password', data.Password);
                
                // Click login button and wait for navigation
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('.decorativeSubmit')
                ]);
            });

            await test.step('Navigate to Create Lead', async () => {
                // Click on CRM/SFA link
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('text=CRM/SFA')
                ]);

                // Click on Leads tab
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('text=Leads')
                ]);

                // Click on Create Lead
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('text=Create Lead')
                ]);
            });

            await test.step('Fill Lead Information', async () => {
                // Wait for the form to be visible
                await page.waitForSelector('#createLeadForm_companyName', { state: 'visible' });

                // Fill in the required fields
                await page.fill('#createLeadForm_companyName', companyName);
                await page.fill('#createLeadForm_firstName', firstName);
                await page.fill('#createLeadForm_lastName', lastName);

                // Fill in optional fields if provided
                if (data.Source) {
                    await page.selectOption('select[name="dataSourceId"]', { label: data.Source });
                }
                if (data.MarketingCampaign) {
                    await page.selectOption('select[name="marketingCampaignId"]', { label: data.MarketingCampaign });
                }
                if (data.Industry) {
                    await page.selectOption('select[name="industryEnumId"]', { label: data.Industry });
                }
                if (data.Ownership) {
                    await page.selectOption('select[name="ownershipEnumId"]', { label: data.Ownership });
                }

                // Fill contact information
                if (data.Phone) {
                    await page.fill('#createLeadForm_primaryPhoneNumber', data.Phone);
                }
                if (data.Email) {
                    await page.fill('#createLeadForm_primaryEmail', data.Email);
                }

                // Fill address information
                if (data.Country) {
                    await page.selectOption('select[name="generalCountryGeoId"]', { label: data.Country });
                    // Wait for state options to load after country selection
                    await page.waitForTimeout(1000);
                }
                if (data.State) {
                    await page.selectOption('select[name="generalStateProvinceGeoId"]', { label: data.State });
                }
                if (data.City) {
                    await page.fill('#createLeadForm_generalCity', data.City);
                }
            });

            await test.step('Submit Lead Form', async () => {
                // Click create lead button and wait for navigation
                await Promise.all([
                    page.waitForNavigation(),
                    page.click('input[name="submitButton"]')
                ]);

                // Verify lead creation if expected
                if (data.ExpectedResult === 'Success') {
                    // Wait for the view lead page to load
                    await page.waitForSelector('#viewLead_companyName_sp');
                    
                    // Get the displayed company name
                    const displayedCompanyName = await page.textContent('#viewLead_companyName_sp');
                    
                    // Verify the company name matches
                    expect(displayedCompanyName).toContain(companyName);
                } else {
                    // Verify error message exists
                    await page.waitForSelector('.errorMessage');
                    const errorMessage = await page.textContent('.errorMessage');
                    expect(errorMessage).toBeTruthy();
                }
            });
        });
    }
});