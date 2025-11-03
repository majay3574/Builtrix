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
                await page.getByRole('link', { name: 'CRM/SFA' }).click();
                await page.getByRole('link', { name: 'Leads' }).click();
                await page.getByRole('link', { name: 'Create Lead' }).click();
            });

            await test.step('Fill Lead Information', async () => {
                await page.locator('#createLeadForm_companyName').fill(companyName);
                await page.locator('#createLeadForm_firstName').fill(firstName);
                await page.locator('#createLeadForm_lastName').fill(lastName);

                if (data.Source) {
                    await page.selectOption('#createLeadForm_dataSourceId', data.Source);
                }
                if (data.MarketingCampaign) {
                    await page.selectOption('#createLeadForm_marketingCampaignId', data.MarketingCampaign);
                }
                if (data.Industry) {
                    await page.selectOption('#createLeadForm_industryEnumId', data.Industry);
                }
                if (data.Ownership) {
                    await page.selectOption('#createLeadForm_ownershipEnumId', data.Ownership);
                }

                // Fill contact information if provided
                if (data.Phone) await page.locator('#createLeadForm_primaryPhoneNumber').fill(data.Phone);
                if (data.Email) await page.locator('#createLeadForm_primaryEmail').fill(data.Email);

                // Fill address information if provided
                if (data.Country) await page.locator('#createLeadForm_generalCountryGeoId').fill(data.Country);
                if (data.State) await page.locator('#createLeadForm_generalStateProvinceGeoId').fill(data.State);
                if (data.City) await page.locator('#createLeadForm_generalCity').fill(data.City);
            });

            await test.step('Submit Lead Form', async () => {
                await page.getByRole('button', { name: 'Create Lead' }).click();
                await page.waitForLoadState('networkidle');
            });

            await test.step('Verify Lead Creation', async () => {
                if (data.ExpectedResult === 'Success') {
                    // Verify lead creation success
                    await page.waitForSelector('#viewLead_companyName_sp');
                    const actualCompanyName = await page.locator('#viewLead_companyName_sp').innerText();
                    test.expect(actualCompanyName).toBe(companyName);
                } else {
                    // Verify error message
                    await page.waitForSelector('.errorMessage');
                }
            });

            await test.step('Logout', async () => {
                await page.getByRole('link', { name: 'Logout' }).click();
                await page.waitForLoadState('networkidle');
            });
        });
    }
});